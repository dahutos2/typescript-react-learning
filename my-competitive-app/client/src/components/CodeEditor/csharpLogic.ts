import * as monacoEditor from 'monaco-editor';

/**
 * サーバーにC#の診断を依頼し、markersを更新する。
 * @param code ユーザーの入力C#コード
 * @param model Monacoのテキストモデル
 * @param monaco Monacoインスタンス
 */
export async function diagnoseCSharpCode(
    code: string,
    model: monacoEditor.editor.ITextModel,
    monaco: typeof monacoEditor
) {
    try {
        const response = await fetch('/api/csharp-diagnose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });
        if (!response.ok) {
            throw new Error(`C#診断サーバーエラー: ${response.statusText}`);
        }
        const data = await response.json();
        const { errors = [], warnings = [] } = data;

        // markersに変換
        const newMarkers: monacoEditor.editor.IMarkerData[] = [
            ...errors.map((err: any) => ({
                severity: monacoEditor.MarkerSeverity.Error,
                startLineNumber: err.line,
                startColumn: err.character,
                endLineNumber: err.line,
                endColumn: err.character + 1,
                message: err.message,
                code: 'CS_ERROR',
            })),
            ...warnings.map((warn: any) => ({
                severity: monacoEditor.MarkerSeverity.Warning,
                startLineNumber: warn.line,
                startColumn: warn.character,
                endLineNumber: warn.line,
                endColumn: warn.character + 1,
                message: warn.message,
                code: 'CS_WARNING',
            })),
        ];

        monaco.editor.setModelMarkers(model, 'csharp', newMarkers);
    } catch (error) {
        console.error('C#の診断リクエストに失敗:', error);
    }
}

/**
 * C#向けの補完・ホバー・シグネチャなどを登録する。
 * サーバーを呼び出して結果を返すイメージ。
 * @param monaco Monacoインスタンス
 * @param userId ユーザーID等（サーバーに渡す想定）
 */
export function registerCSharpProviders(
    monaco: typeof monacoEditor,
    userId: string
) {
    // --- 補完 ---
    monaco.languages.registerCompletionItemProvider('csharp', {
        triggerCharacters: ['.', ' '],
        provideCompletionItems: async (model, position) => {
            const code = model.getValue();
            const cursorPosition = model.getOffsetAt(position);

            try {
                const res = await fetch('/api/csharp-complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, code, cursorPosition }),
                });
                if (!res.ok) {
                    throw new Error(`C#補完サーバーエラー: ${res.statusText}`);
                }
                const data = await res.json();
                const suggestionsRaw = data.suggestions || [];

                const suggestions = suggestionsRaw.map((item: any) => {
                    const kindEnum = (monaco.languages.CompletionItemKind as any)[item.kind]
                        || monaco.languages.CompletionItemKind.Text;

                    return {
                        label: item.label,
                        kind: kindEnum,
                        insertText: item.insertText,
                        detail: item.detail,
                    };
                });

                return { suggestions };
            } catch (err) {
                console.error('C#補完失敗:', err);
                return { suggestions: [] };
            }
        }
    });

    // --- ホバー ---
    monaco.languages.registerHoverProvider('csharp', {
        provideHover: async (model, position) => {
            const code = model.getValue();
            const cursorPosition = model.getOffsetAt(position);

            try {
                const res = await fetch('/api/csharp-hover', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, code, position: cursorPosition }),
                });
                if (!res.ok) {
                    throw new Error(`C#ホバーサーバーエラー: ${res.statusText}`);
                }
                const data = await res.json();
                if (data.information) {
                    return { contents: [{ value: data.information }] };
                }
                return null;
            } catch (error) {
                console.error('C#ホバーリクエスト失敗:', error);
                return null;
            }
        }
    });

    // --- シグネチャヘルプ ---
    monaco.languages.registerSignatureHelpProvider('csharp', {
        signatureHelpTriggerCharacters: ['(', ','],
        provideSignatureHelp: async (model, position) => {
            const code = model.getValue();
            const cursorPosition = model.getOffsetAt(position);
            try {
                const res = await fetch('/api/csharp-signatureHelp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, code, position: cursorPosition }),
                });
                if (!res.ok) {
                    throw new Error(`C#シグネチャサーバーエラー: ${res.statusText}`);
                }

                const data = await res.json();
                if (data.signatures && data.activeSignature !== undefined && data.activeParameter !== undefined) {
                    return {
                        value: {
                            signatures: data.signatures,
                            activeSignature: data.activeSignature,
                            activeParameter: data.activeParameter
                        },
                        dispose: () => { }
                    };
                }
            } catch (error) {
                console.error('C#シグネチャヘルプリクエスト失敗:', error);
            }
            return null;
        }
    });

    // --- タブ補完 ---
    monaco.languages.registerCompletionItemProvider('csharp', {
        triggerCharacters: ['.', ' '],
        provideCompletionItems: async (model, position) => {
            const code = model.getValue();
            const cursorPosition = model.getOffsetAt(position);

            try {
                const res = await fetch('/api/csharp-tabCompletion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, code, position: cursorPosition }),
                });
                if (!res.ok) {
                    throw new Error(`C#タブ補完サーバーエラー: ${res.statusText}`);
                }

                const data = await res.json();
                const items = data.suggestions || [];
                const suggestions = items.map((item: any) => ({
                    label: item.suggestion,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: item.suggestion,
                    detail: item.description || ''
                }));

                return { suggestions };
            } catch (error) {
                console.error('C#タブ補完リクエスト失敗:', error);
                return { suggestions: [] };
            }
        }
    });

    // --- クイックフィックスの登録 ---
    monaco.languages.registerCodeActionProvider('csharp', {
        provideCodeActions: async (model, range, context, token) => {
            const diagnostics = context.markers;
            const actions: monacoEditor.languages.CodeAction[] = [];

            for (const diagnostic of diagnostics) {
                // 未定義の型エラーを検出（例: CS0246）
                if (typeof diagnostic.code === 'string' && diagnostic.code.startsWith('CS')) {
                    const typeNameMatch = /The type or namespace name '([\w.]+)' could not be found/.exec(diagnostic.message ?? '');
                    if (typeNameMatch?.[1]) { // オプショナルチェイニングを使用
                        const typeName = typeNameMatch[1];
                        const lastDotIndex = typeName.lastIndexOf('.');
                        if (lastDotIndex > 0) {
                            const namespaceName = typeName.substring(0, lastDotIndex);

                            // クイックフィックスを追加
                            actions.push({
                                title: `Add using ${namespaceName};`,
                                command: {
                                    id: 'addUsing',
                                    title: 'Add Using',
                                    arguments: [model, namespaceName]
                                },
                                diagnostics: [diagnostic],
                                kind: 'quickfix'
                            });
                        }
                    }
                }
            }

            return {
                actions,
                dispose: () => { }
            };
        }
    });

    // --- クイックフィックス用のコマンドの登録 ---
    monaco.editor.registerCommand('addUsing', (accessor, args) => {
        // 型安全性の確保
        if (!Array.isArray(args) || args.length < 2) {
            console.error('addUsing コマンドの引数が不正です。');
            return;
        }

        const [model, namespaceName] = args as [monacoEditor.editor.ITextModel, string];
        const fullText = model.getValue();

        // `using` が既に存在するか確認
        if (fullText.includes(`using ${namespaceName};`)) {
            return;
        }

        // 最後の `using` の後に挿入
        const usingRegex = /^\s*using\s+[^\s;]+;\s*$/gm;
        let lastMatch: RegExpExecArray | null = null;
        let match: RegExpExecArray | null;

        while ((match = usingRegex.exec(fullText)) !== null) {
            lastMatch = match;
        }

        let insertPosition: monacoEditor.Position;
        if (lastMatch) {
            const index = lastMatch.index + lastMatch[0].length;
            insertPosition = model.getPositionAt(index);
        } else {
            // `using` が存在しない場合、名前空間宣言の前に挿入
            const namespaceRegex = /^\s*namespace\s+\w+/m;
            const nsMatch = namespaceRegex.exec(fullText);
            if (nsMatch) {
                insertPosition = model.getPositionAt(nsMatch.index);
            } else {
                // 名前空間宣言もない場合、ファイルの先頭に挿入
                insertPosition = new monacoEditor.Position(1, 1);
            }
        }

        // `using` ステートメントを挿入
        model.applyEdits([{
            range: new monacoEditor.Range(insertPosition.lineNumber, insertPosition.column, insertPosition.lineNumber, insertPosition.column),
            text: `using ${namespaceName};\n`
        }]);
    });
}