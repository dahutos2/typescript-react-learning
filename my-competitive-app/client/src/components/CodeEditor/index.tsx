import React, { useRef, useEffect } from 'react';
import MonacoEditor, {
    OnMount,
    BeforeMount,
    Monaco
} from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor';
import debounce from 'lodash.debounce';
import styles from './CodeEditor.module.css';
import Button from '../shared/Button';
import { LangOption } from '../../utils/types';

// C#用の診断・補完ロジック（サーバー呼び出し）
import { diagnoseCSharpCode, registerCSharpProviders } from './csharpLogic';
// TypeScript用のローカル診断・補完ロジック
import { setupTypeScriptDefaults, registerTypeScriptProviders } from './typescriptLogic';

interface CodeEditorProps {
    userId: string;
    initialCode: string;
    onCodeChange: (code: string) => void;
    language: LangOption; // 'csharp' or 'typescript'
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    userId,
    initialCode,
    onCodeChange,
    language
}) => {
    // エディタおよびMonacoインスタンスを参照保持するRef
    const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);

    // テーマやフォントサイズなどのUI用ステート
    const [fontSize, setFontSize] = React.useState<number>(14);
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

    // 言語別のダーク/ライトテーマ名を設定
    const darkTheme: string = (language === 'csharp') ? 'csharp-dark' : 'typescript-dark';
    const lightTheme: string = (language === 'csharp') ? 'csharp-light' : 'typescript-light';
    const editorTheme: string = (theme === 'dark') ? darkTheme : lightTheme;

    // Monaco Editor の各種オプション
    const editorOptions: monacoEditor.editor.IStandaloneEditorConstructionOptions = {
        fontSize,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        insertSpaces: true,
        folding: true,
        renderLineHighlight: 'all',
        cursorStyle: 'line',
        cursorBlinking: 'smooth',
        acceptSuggestionOnEnter: 'on',
        renderValidationDecorations: 'on',
        acceptSuggestionOnCommitCharacter: true,
        quickSuggestions: { other: true, comments: false, strings: true },
        tabCompletion: 'on'
    };

    /**
     * エディタがマウントする前に呼ばれるコールバック。
     * 言語別にテーマを定義する。
     */
    const handleEditorWillMount: BeforeMount = (monaco) => {
        if (language === 'csharp') {
            // C#用テーマを定義
            monaco.editor.defineTheme('csharp-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
                    { token: 'string', foreground: 'D69D85' },
                    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                    { token: 'function', foreground: 'DCDCAA' },
                ],
                colors: { 'editor.background': '#1E1E1E' },
            });
            monaco.editor.defineTheme('csharp-light', {
                base: 'vs',
                inherit: true,
                rules: [
                    { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
                    { token: 'string', foreground: 'A31515' },
                    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                    { token: 'function', foreground: '795E26' },
                ],
                colors: { 'editor.background': '#FFFFFF' },
            });
        } else {
            // TypeScript用テーマを定義
            monaco.editor.defineTheme('typescript-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
                    { token: 'string', foreground: 'D69D85' },
                    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                    { token: 'function', foreground: 'DCDCAA' },
                ],
                colors: { 'editor.background': '#1E1E1E' },
            });
            monaco.editor.defineTheme('typescript-light', {
                base: 'vs',
                inherit: true,
                rules: [
                    { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
                    { token: 'string', foreground: 'A31515' },
                    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                    { token: 'function', foreground: '795E26' },
                ],
                colors: { 'editor.background': '#FFFFFF' },
            });
        }
    };

    /**
     * エディタがマウント完了した後に呼ばれるコールバック。
     * エディタインスタンス・monacoインスタンスをRefに保持し、
     * 言語別のプロバイダー登録などを行う。
     */
    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        if (language === 'csharp') {
            // C#向け：補完やシグネチャなどのプロバイダーを設定
            registerCSharpProviders(monaco, userId);
        } else {
            // TypeScript向け：TypeScriptのデフォルト設定やプロバイダー
            setupTypeScriptDefaults(monaco);
            registerTypeScriptProviders(monaco);
        }
    };

    /**
     * C#の診断をサーバーに依頼するのをdebounceして呼び出す。
     * TypeScriptの場合は不要だが、フロントで一元管理している。
     */
    const debouncedGetDiagnostics = useRef(
        debounce((code: string) => {
            if (language === 'csharp') {
                // C#のみサーバー診断を実行
                const monaco = monacoRef.current;
                const editor = editorRef.current;
                if (monaco && editor) {
                    const model = editor.getModel();
                    if (model) {
                        diagnoseCSharpCode(code, model, monaco);
                    }
                }
            }
            // コールバックを呼んで上位コンポーネントに反映
            onCodeChange(code);
        }, 500)
    ).current;

    /**
     * 親から initialCode が変わったときに診断を再走させる
     */
    useEffect(() => {
        debouncedGetDiagnostics(initialCode);
    }, [initialCode, debouncedGetDiagnostics]);

    /**
     * ユーザーがエディタでタイプした時のコールバック。
     * (monacoEditor が onChange で呼び出す)
     */
    const handleEditorChange = (value?: string) => {
        if (value !== undefined) {
            debouncedGetDiagnostics(value);
        }
    };

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            <div className={styles.editorContainer}>
                {/* エディタのヘッダ（ボタン類） */}
                <div className={styles.editorHeader}>
                    <div className={styles.editorTitle}>解答コード入力欄</div>
                    <div className={styles.editorControls}>
                        <Button onClick={() => setFontSize(prev => Math.min(prev + 1, 32))}>拡大</Button>
                        <Button onClick={() => setFontSize(prev => Math.max(prev - 1, 8))}>縮小</Button>
                        <Button onClick={() => setTheme('light')}>ライト</Button>
                        <Button onClick={() => setTheme('dark')}>ダーク</Button>
                    </div>
                </div>

                <div className={styles.editorBody}>
                    {/* MonacoEditor本体 */}
                    <MonacoEditor
                        height="400px"
                        language={language === 'csharp' ? 'csharp' : 'typescript'}
                        theme={editorTheme}
                        value={initialCode}
                        onChange={handleEditorChange}
                        beforeMount={handleEditorWillMount}
                        onMount={handleEditorDidMount}
                        options={editorOptions}
                    />
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;