Visual Studio Code（VS Code）やVisual Studioのような見た目と機能を持つコードエディターをReactアプリケーションに統合するには、Monaco Editor や React Ace などの強力なエディターライブラリを使用することをお勧めします。ここでは、Monaco Editor を使用して、C#とTypeScriptそれぞれに適した見た目と機能を持つコードエディターを実装する方法をご紹介します。

1. Monaco Editor の導入

a. 必要なパッケージのインストール

まず、Monaco EditorをReactプロジェクトに導入するために必要なパッケージをインストールします。

# クライアントディレクトリに移動
cd client

# 必要なパッケージをインストール
npm install @monaco-editor/react

b. CSS スタイルの追加（オプション）

Monaco Editorはデフォルトでスタイルが適用されていますが、必要に応じてカスタムスタイルを追加することもできます。今回は基本的なスタイルのみを使用します。

2. CodeEditor コンポーネントの作成

Monaco Editorを使用して、C#とTypeScriptに応じて見た目や機能を変更するコードエディターコンポーネントを作成します。

a. 必要なインポートと設定

以下のコードでは、Monaco Editorの基本的な設定と、C#とTypeScriptそれぞれの言語に応じたカスタマイズを行います。

// client/src/components/CodeEditor.tsx

import React, { useState, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor';
import './CodeEditor.css'; // カスタムスタイル用

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: 'csharp' | 'typescript';
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  const [fontSize, setFontSize] = useState<number>(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Monaco Editor のテーマ設定
  const editorTheme = theme === 'dark' ? 'vs-dark' : 'vs-light';

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
    // 言語ごとの特定の設定を追加可能
    // 例: C#では IntelliSense を有効にするなど
  };

  // 言語ごとのカスタマイズ（オプション）
  const handleEditorWillMount = (monaco: Monaco) => {
    if (language === 'csharp') {
      // C# 用のカスタマイズを追加
      // 例: 特定のテーマやキーバインドの設定
    } else if (language === 'typescript') {
      // TypeScript 用のカスタマイズを追加
    }
  };

  return (
    <div className='editor-container'>
      <div className='editor-header'>
        <div className='editor-title'>{language.toUpperCase()} Code Editor</div>
        <div className='editor-controls'>
          <button className='btn' onClick={() => setFontSize(prev => Math.min(prev + 1, 32))}>拡大</button>
          <button className='btn' onClick={() => setFontSize(prev => Math.max(prev - 1, 8))}>縮小</button>
          <button className='btn' onClick={() => setTheme('light')}>ライト</button>
          <button className='btn' onClick={() => setTheme('dark')}>ダーク</button>
        </div>
      </div>
      <div className='editor-body'>
        <Editor
          height="400px"
          defaultLanguage={language}
          language={language}
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

b. カスタムスタイルの追加

エディターの見た目を整えるために、以下のようなCSSスタイルを追加します。必要に応じてスタイルを調整してください。

/* client/src/components/CodeEditor.css */

.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  padding: 8px;
}

.editor-title {
  font-weight: bold;
}

.editor-controls .btn {
  margin-left: 4px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
}

.editor-body {
  height: 400px; /* 必要に応じて調整 */
}

3. コンポーネントの使用例

以下のように、CodeEditor コンポーネントをアプリケーション内で使用します。C#とTypeScriptそれぞれに異なる設定や初期コードを提供します。

// client/src/App.tsx

import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import './App.css'; // 必要に応じてスタイルを追加

const App: React.FC = () => {
  const [codeCSharp, setCodeCSharp] = useState<string>(
    `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}`
  );

  const [codeTypeScript, setCodeTypeScript] = useState<string>(
    `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`
  );

  return (
    <div className='app-container'>
      <h1>競技プログラミング学習アプリ</h1>
      
      <div className='editor-section'>
        <h2>C# エディター</h2>
        <CodeEditor
          code={codeCSharp}
          onChange={setCodeCSharp}
          language='csharp'
        />
      </div>

      <div className='editor-section'>
        <h2>TypeScript エディター</h2>
        <CodeEditor
          code={codeTypeScript}
          onChange={setCodeTypeScript}
          language='typescript'
        />
      </div>
    </div>
  );
};

export default App;

/* client/src/App.css */

.app-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.editor-section {
  margin-bottom: 40px;
}

4. 言語ごとのカスタマイズ（オプション）

Monaco Editorでは、言語ごとに特定の設定や機能を追加することが可能です。例えば、C#用にIntelliSenseや特定のテーマを適用したい場合、handleEditorWillMount 関数内でカスタマイズを行います。

以下は、C#とTypeScriptそれぞれに異なるテーマを適用する例です。

// client/src/components/CodeEditor.tsx

const handleEditorWillMount = (monaco: Monaco) => {
  if (language === 'csharp') {
    monaco.editor.defineTheme('csharp-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        // 追加のカスタムルール
      ],
      colors: {
        'editor.background': '#1E1E1E',
      },
    });
    monaco.editor.setTheme('csharp-theme');
  } else if (language === 'typescript') {
    monaco.editor.defineTheme('typescript-theme', {
      base: 'vs-light',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        // 追加のカスタムルール
      ],
      colors: {
        'editor.background': '#FFFFFF',
      },
    });
    monaco.editor.setTheme('typescript-theme');
  }
};

このようにして、言語ごとにテーマやルールをカスタマイズすることができます。

5. 完全なコード例

以下に、上述したすべての変更を反映した完全なコード例を示します。

a. CodeEditor.tsx

// client/src/components/CodeEditor.tsx

import React, { useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor';
import './CodeEditor.css'; // カスタムスタイル用

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: 'csharp' | 'typescript';
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  const [fontSize, setFontSize] = useState<number>(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Monaco Editor のテーマ設定
  const editorTheme = theme === 'dark' ? 'vs-dark' : 'vs-light';

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
  };

  // 言語ごとのカスタマイズ
  const handleEditorWillMount = (monaco: Monaco) => {
    if (language === 'csharp') {
      monaco.editor.defineTheme('csharp-theme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
          // 追加のカスタムルール
        ],
        colors: {
          'editor.background': '#1E1E1E',
        },
      });
      monaco.editor.setTheme('csharp-theme');
    } else if (language === 'typescript') {
      monaco.editor.defineTheme('typescript-theme', {
        base: 'vs-light',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
          // 追加のカスタムルール
        ],
        colors: {
          'editor.background': '#FFFFFF',
        },
      });
      monaco.editor.setTheme('typescript-theme');
    }
  };

  return (
    <div className='editor-container'>
      <div className='editor-header'>
        <div className='editor-title'>{language.toUpperCase()} Code Editor</div>
        <div className='editor-controls'>
          <button className='btn' onClick={() => setFontSize(prev => Math.min(prev + 1, 32))}>拡大</button>
          <button className='btn' onClick={() => setFontSize(prev => Math.max(prev - 1, 8))}>縮小</button>
          <button className='btn' onClick={() => setTheme('light')}>ライト</button>
          <button className='btn' onClick={() => setTheme('dark')}>ダーク</button>
        </div>
      </div>
      <div className='editor-body'>
        <Editor
          height="400px"
          defaultLanguage={language}
          language={language}
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

b. CodeEditor.css

/* client/src/components/CodeEditor.css */

.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  padding: 8px 12px;
}

.editor-title {
  font-weight: bold;
  font-size: 16px;
}

.editor-controls .btn {
  margin-left: 4px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  background-color: #e0e0e0;
  border: none;
  border-radius: 3px;
}

.editor-controls .btn:hover {
  background-color: #d5d5d5;
}

.editor-body {
  height: 400px; /* 必要に応じて調整 */
}

c. App.tsx

// client/src/App.tsx

import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import './App.css'; // 必要に応じてスタイルを追加

const App: React.FC = () => {
  const [codeCSharp, setCodeCSharp] = useState<string>(
    `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}`
  );

  const [codeTypeScript, setCodeTypeScript] = useState<string>(
    `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`
  );

  return (
    <div className='app-container'>
      <h1>競技プログラミング学習アプリ</h1>
      
      <div className='editor-section'>
        <h2>C# エディター</h2>
        <CodeEditor
          code={codeCSharp}
          onChange={setCodeCSharp}
          language='csharp'
        />
      </div>

      <div className='editor-section'>
        <h2>TypeScript エディター</h2>
        <CodeEditor
          code={codeTypeScript}
          onChange={setCodeTypeScript}
          language='typescript'
        />
      </div>
    </div>
  );
};

export default App;

d. App.css

/* client/src/App.css */

.app-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.editor-section {
  margin-bottom: 40px;
}

6. 追加機能の実装（オプション）

Monaco Editorは多くの拡張機能をサポートしており、以下のような追加機能を実装することができます。

a. キーバインドのカスタマイズ

VS Codeと同様のキーバインドを設定することが可能です。

// CodeEditor.tsx 内の handleEditorWillMount 関数内

monaco.editor.defineTheme('csharp-theme', { /* ... */ });

// キーバインドの追加
monaco.keyboardLayout = {
  'editor.action.formatDocument': 'Ctrl+Shift+F',
  // 他のキーバインドを定義
};

b. IntelliSense の有効化

Monaco Editorでは、言語サービスを利用してIntelliSenseを提供することができます。これは言語ごとに異なる設定が必要です。

// 例: TypeScriptの場合
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2019,
  allowNonTsExtensions: true,
});

c. 補完機能のカスタマイズ

補完機能をカスタマイズすることで、より高度な支援が可能です。

monaco.languages.registerCompletionItemProvider('typescript', {
  provideCompletionItems: () => {
    return {
      suggestions: [
        {
          label: 'console.log',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'console.log($1);',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Log output to console',
        },
        // 他の補完項目
      ],
    };
  },
});

7. まとめ

Monaco Editorを使用することで、VS CodeやVisual Studioと同様の見た目と機能を持つコードエディターをReactアプリケーションに統合することができます。以下のステップを踏むことで、シンプルでありながら強力なエディターを実装できます。
	1.	Monaco Editorの導入:
	•	必要なパッケージをインストール。
	•	コンポーネントを作成し、基本的な設定を行う。
	2.	カスタムスタイルの適用:
	•	CSSを使用してエディターの見た目を整える。
	3.	言語ごとのカスタマイズ:
	•	C#とTypeScriptそれぞれに適したテーマや機能を設定。
	4.	追加機能の実装（オプション）:
	•	キーバインドのカスタマイズ、IntelliSenseの有効化、補完機能の拡張など。

これにより、ユーザーはVisual StudioやVS Codeと同様の快適なコーディング体験を得ることができます。また、Monaco Editorの豊富なAPIを活用することで、さらに高度な機能を追加することも可能です。

参考資料
	•	Monaco Editor React Integration
	•	Monaco Editor Documentation
	•	Monaco Editor API Reference

もし追加のカスタマイズや機能の実装についてご質問があれば、お気軽にお知らせください。
