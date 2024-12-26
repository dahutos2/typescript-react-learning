import React, { useState, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor';
import { getSuggestions } from '../../utils/suggestions';
import { LangOption } from '../../utils/types';
import defaultCodes from '../../data/defaultCodes.json';
import styles from './CodeEditor.module.css';
import Button from '../shared/Button';

interface CodeEditorProps {
    code: string;
    onChange: (newCode: string) => void;
    language: LangOption;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
    const [fontSize, setFontSize] = useState<number>(14);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Monaco Editor のテーマ設定
    const darkTheme: string = language === 'csharp' ? 'csharp-dark' : 'typescript-dark';
    const lightTheme: string = language === 'csharp' ? 'csharp-light' : 'typescript-light';
    const editorTheme: string = theme === 'dark' ? darkTheme : lightTheme;

    // Monaco Editor のオプション設定
    const editorOptions: monacoEditor.editor.IStandaloneEditorConstructionOptions = {
        fontSize: fontSize,
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
    };

    // 言語ごとのカスタマイズ
    const handleEditorWillMount = (monaco: Monaco) => {
        if (language === 'csharp') {
            monaco.editor.defineTheme('csharp-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
                    { token: 'string', foreground: 'D69D85' },
                    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                    { token: 'function', foreground: 'DCDCAA' },
                ],
                colors: {
                    'editor.background': '#1E1E1E',
                },
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
                colors: {
                    'editor.background': '#FFFFFF',
                },
            });

            // C# のカスタム補完アイテムを追加
            monaco.languages.registerCompletionItemProvider('csharp', {
                provideCompletionItems: (model, position) => {
                    const suggestions = getSuggestions(position, model);
                    return { suggestions };
                },
            });
        } else if (language === 'typescript') {
            monaco.editor.defineTheme('typescript-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
                    { token: 'string', foreground: 'D69D85' },
                    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                    { token: 'function', foreground: 'DCDCAA' },
                ],
                colors: {
                    'editor.background': '#1E1E1E',
                },
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
                colors: {
                    'editor.background': '#FFFFFF',
                },
            });

            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ES2019,
                allowNonTsExtensions: true,
                strict: true,
                noEmit: true,
            });

            // TypeScript のカスタム補完アイテムを追加
            monaco.languages.registerCompletionItemProvider('typescript', {
                provideCompletionItems: (model, position) => {
                    const suggestions = getSuggestions(position, model);
                    return { suggestions };
                },
            });
        }
    };

    // デフォルトコードの変更を通知
    useEffect(() => {
        onChange(defaultCodes[language]);
    }, [language, onChange]);

    return (
        <div className={styles.editorContainer}>
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
                <Editor
                    height="400px"
                    language={language === 'csharp' ? 'csharp' : 'typescript'}
                    theme={editorTheme}
                    value={code}
                    onChange={(value) => onChange(value || '')}
                    options={editorOptions}
                    beforeMount={handleEditorWillMount}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
