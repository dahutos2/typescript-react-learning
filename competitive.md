以下では、**最初からフォルダ構成を準備し、必要なコマンドを打ち込んで環境を構築し、最終的にローカルでサーバ(Express＋TypeScript) とクライアント(React＋TypeScript) を起動して動かす**までの一連の手順を示します。  
**この手順どおりに進めれば、フォルダ構成・パッケージインストール・コード配置が完了し、要件を満たすアプリが動く**状態になります。

> - **Windows**を想定して `csc` コマンドを使う例を示します。  
> - Mac / Linux 環境の場合は、**C#コンパイラを mcs / dotnet CLI** などに適宜置き換えてください。  
> - **TypeScriptコンパイラ(`tsc`)** はグローバルにインストール済みか、Pathが通っている前提です。  
> - **Node.js / npm** がインストール済みであることも前提です。  

---

# フォルダ構成

最終的に作られるフォルダ構成は次の通りです。

```
my-competitive-app/
  ├─ package.json          
  ├─ tsconfig.json         
  ├─ server/
  │   ├─ server.ts         
  │   ├─ runCode.ts        
  │   └─ tsconfig.json     
  ├─ client/
  │   ├─ package.json      
  │   ├─ tsconfig.json     
  │   ├─ public/
  │   │   └─ index.html
  │   └─ src/
  │       ├─ index.tsx
  │       ├─ App.tsx
  │       ├─ data/
  │       │   └─ tasks.json
  │       ├─ styles/
  │       │   └─ style.css
  │       └─ components/
  │           ├─ Timer.tsx
  │           ├─ CodeEditor.tsx
  │           └─ TaskRunner.tsx
  ├─ temp/
  └─ dist/
      └─ server/
          ├─ server.js     
          ├─ runCode.js    
          └─ ...          
```

---

# 手順1: フォルダを作成し、移動する

```bash
# 好きな場所でフォルダを作成
mkdir my-competitive-app
cd my-competitive-app
```

---

# 手順2: package.json (ルート) を作成

```bash
# ルート直下でnpm init
npm init -y
```

これで `my-competitive-app/package.json` が生成されます。  
生成された `package.json` を**以下の内容**に書き換えてください。

```jsonc
{
  "name": "my-competitive-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "server:build": "tsc -p ./server/tsconfig.json",
    "server:start": "node ./dist/server/server.js",
    "server:dev": "concurrently \"npm run server:build\" \"npm run server:start\"",
    "client:start": "cd client && npm start",
    "dev": "concurrently \"npm run server:dev\" \"npm run client:start\""
  },
  "dependencies": {
    "concurrently": "^7.6.0",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.14",
    "@types/node": "^18.15.0",
    "nodemon": "^3.1.9",
    "typescript": "^4.9.0"
  }
}
```

> ここで `"concurrently"` を使って**サーバとクライアントを同時に起動**するためにインストールしています。

---

# 手順3: ルートの tsconfig.json を作る (空ファイルでもOK)

```bash
# ルートに tsconfig.json を作る
echo "{}" > tsconfig.json
```

（またはテキストエディタで `tsconfig.json` を開いて `{}` と書くだけでもOK）

---

# 手順4: server フォルダを作成 & 移動

```bash
mkdir server
cd server
```

---

# 手順5: server/tsconfig.json を作成

以下の内容の`server/tsconfig.json`を作成します

```jsonc
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "outDir": "../dist/server",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["./**/*.ts"]
}
```

---

# 手順6: server/server.ts を作成

以下の内容の`server/server.ts`を作成します

```ts
import express from 'express';
import { runCsCode, runTsCode } from './runCode';

const app = express();
const PORT = 4000;

app.use(express.json());

// C#コード実行
app.post('/api/run-cs', async (req, res) => {
  const { code, input } = req.body;
  try {
    const output = await runCsCode(code, input);
    res.json({ success: true, output });
  } catch (error: any) {
    res.json({ success: false, output: error.message });
  }
});

// TypeScriptコード実行
app.post('/api/run-ts', async (req, res) => {
  const { code, input } = req.body;
  try {
    const output = await runTsCode(code, input);
    res.json({ success: true, output });
  } catch (error: any) {
    res.json({ success: false, output: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
```

---

# 手順7: server/runCode.ts を作成

以下の内容の`server/runCode.ts`を作成します

```ts
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, '../../temp');

export function runCsCode(code: string, input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const csFilePath = path.join(tempDir, 'Program.cs');
    fs.writeFileSync(csFilePath, code, 'utf8');

    const compileCmd = `csc "${csFilePath}"`;
    const exePath = path.join(tempDir, 'Program.exe');
    const runCmd = `echo "${input}" | "${exePath}"`;

    exec(compileCmd, (compileErr, _stdout, compileStderr) => {
      if (compileErr) {
        return reject(new Error('C#コンパイルエラー:\n' + compileStderr));
      }
      exec(runCmd, (runErr, runStdout, runStderr) => {
        if (runErr) {
          return reject(new Error('C#実行エラー:\n' + runStderr));
        }
        resolve(runStdout);
      });
    });
  });
}

export function runTsCode(code: string, input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const tsFilePath = path.join(tempDir, 'temp.ts');
    fs.writeFileSync(tsFilePath, code, 'utf8');

    const compileCmd = `tsc "${tsFilePath}" --outDir "${tempDir}"`;
    const jsFilePath = path.join(tempDir, 'temp.js');
    const runCmd = `echo "${input}" | node "${jsFilePath}"`;

    exec(compileCmd, (compileErr, _stdout, compileStderr) => {
      if (compileErr) {
        return reject(new Error('TSコンパイルエラー:\n' + compileStderr));
      }
      exec(runCmd, (runErr, runStdout, runStderr) => {
        if (runErr) {
          return reject(new Error('TS実行エラー:\n' + runStderr));
        }
        resolve(runStdout);
      });
    });
  });
}
```

---

# 手順8: server フォルダ作成完了。戻る

```bash
cd ..
```

これで `my-competitive-app/server/` 下に  
- `tsconfig.json`  
- `server.ts`  
- `runCode.ts`  
が揃いました。

---

# 手順9: temp フォルダを作る

```bash
mkdir temp
```

> ここに `Program.cs` や `temp.ts` が保存され、コンパイルされる想定です。

---

# 手順10: client フォルダを作り、Reactをセットアップ

```bash
npx create-react-app client --template typescript
```

これで `my-competitive-app/client` に**React + TypeScript**プロジェクトが生成されます。  
作成直後は下記のフォルダがあります:

```
client/
  ├─ package.json
  ├─ tsconfig.json
  ├─ ...
  ├─ src/
  └─ public/
```

---

生成された `package.json` を**以下の内容**に書き換えてください。

```jsonc
{
  "name": "my-competitive-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "server:build": "tsc -p ./server/tsconfig.json",
    "server:start": "node ./dist/server/server.js",
    "server:dev": "concurrently \"npm run server:build\" \"npm run server:start\"",
    "client:start": "cd client && npm start",
    "dev": "concurrently \"npm run server:dev\" \"npm run client:start\""
  },
  "dependencies": {
    "concurrently": "^7.6.0",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.14",
    "@types/node": "^18.15.0",
    "nodemon": "^3.1.9",
    "typescript": "^4.9.0"
  }
}
```

生成された `tsconfig.json` を**以下の内容**に書き換えてください。

```jsonc
{
  "compilerOptions": {
    "target": "ES5",
    "lib": [
        "dom",
        "dom.iterable",
        "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
      "src"
  ]
}
```

# 手順11: 不要ファイルを整理

`client/src/` には `App.tsx`, `index.tsx`, などが生成されていますが、
一部はデフォルトで書かれているコードがあるため、**上書き**（または**削除後に新規作成**）していきます。

1. `client/src/` 内のファイルのうち、不要な `App.css`, `App.test.tsx`, `logo.svg` などは削除してOKです。  
2. `client/src/App.tsx`, `client/src/index.tsx` は後で上書きする。

---

# 手順12: 追加フォルダを作る

```bash
cd client
mkdir -p src/data
mkdir -p src/styles
mkdir -p src/components
```

- `data` : `tasks.json` を置く  
- `styles` : `style.css` などを置く  
- `components` : Reactコンポーネント群

---

# 手順13: src/data/tasks.json を作成

```jsonc
[
  {
    "id": 1,
    "title": "配列の合計を求める",
    "description": "与えられた配列の要素の合計値を返してください。",
    "timeLimitSec": 30,
    "testCases": [
      { "input": "3\n1 2 3", "output": "6" },
      { "input": "4\n10 20 30 40", "output": "100" }
    ]
  },
  {
    "id": 2,
    "title": "文字列を逆順にする",
    "description": "与えられた文字列を逆順にして返してください。",
    "timeLimitSec": 45,
    "testCases": [
      { "input": "Hello", "output": "olleH" },
      { "input": "ChatGPT", "output": "TPGtahC" }
    ]
  }
]
```

---

# 手順14: src/styles/style.css を作成

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 20px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
.disqualified {
  color: red;
  font-size: 20px;
  text-align: center;
  margin-top: 50px;
}
.timer {
  font-weight: bold;
  margin-bottom: 10px;
}
.btn {
  display: inline-block;
  margin: 0 5px;
  padding: 5px 10px;
  background: #0077aa;
  color: #fff;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  text-decoration: none;
}
.btn:hover {
  background: #005f88;
}
.editor-container {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  background: #f8f8f8;
}
.editor-header {
  background: #e0e0e0;
  padding: 5px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.editor-body {
  padding: 10px;
}
.code-textarea {
  width: 100%;
  min-height: 200px;
  font-family: monospace;
  font-size: 14px;
  border: none;
  outline: none;
  resize: vertical;
  background: #fff;
}
.output {
  border: 1px solid #ccc;
  background: #fff;
  min-height: 100px;
  margin: 10px 0;
  white-space: pre-wrap;
  padding: 10px;
}
```

---

# 手順15: src/components/Timer.tsx

```tsx
import React, { useEffect, useState } from 'react';

interface TimerProps {
  totalSec: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ totalSec, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(totalSec);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  return <div>残り時間: {timeLeft}秒</div>;
};

export default Timer;
```

---

# 手順16: src/components/CodeEditor.tsx

```tsx
import React, { useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleZoomIn = () => {
    setFontSize(prev => Math.min(prev + 1, 32));
  };
  const handleZoomOut = () => {
    setFontSize(prev => Math.max(prev - 1, 8));
  };

  return (
    <div className='editor-container'>
      <div className='editor-header'>
        <div>
          {language} Code Editor
        </div>
        <div>
          <button className='btn' onClick={handleZoomIn}>拡大</button>
          <button className='btn' onClick={handleZoomOut}>縮小</button>
          <button className='btn' onClick={() => setTheme('light')}>ライト</button>
          <button className='btn' onClick={() => setTheme('dark')}>ダーク</button>
        </div>
      </div>
      <div
        className='editor-body'
        style={{
          background: theme === 'dark' ? '#2e2e2e' : '#fff'
        }}
      >
        <textarea
          className='code-textarea'
          style={{
            fontSize: `${fontSize}px`,
            background: theme === 'dark' ? '#1e1e1e' : '#fff',
            color: theme === 'dark' ? '#eee' : '#000'
          }}
          value={code}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
```

---

# 手順17: src/components/TaskRunner.tsx

```tsx
import React, { useState } from 'react';
import CodeEditor from './CodeEditor';

interface TestCase {
  input: string;
  output: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  timeLimitSec: number;
  testCases: TestCase[];
}

interface TaskRunnerProps {
  task: Task;
}

type LangOption = 'csharp' | 'typescript';

const TaskRunner: React.FC<TaskRunnerProps> = ({ task }) => {
  const [language, setLanguage] = useState<LangOption>('csharp');
  const [userCode, setUserCode] = useState('');
  const [sampleIndex, setSampleIndex] = useState(0);
  const [output, setOutput] = useState('');

  const handleCompileAndTest = async () => {
    setOutput('実行中...');
    const testCase = task.testCases[sampleIndex];
    if (!testCase) {
      setOutput('テストケースが選択されていません');
      return;
    }
    try {
      const url = language === 'csharp' ? '/api/run-cs' : '/api/run-ts';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: userCode, input: testCase.input })
      });
      const data = await res.json();
      if (!data.success) {
        setOutput(`エラー:\n${data.output}`);
      } else {
        setOutput(data.output);
      }
    } catch (err: any) {
      setOutput(`通信エラー: ${err.message}`);
    }
  };

  const handleSubmit = async () => {
    setOutput('提出中...');
    let resultMessage = '';
    let allPassed = true;

    for (const tc of task.testCases) {
      try {
        const url = language === 'csharp' ? '/api/run-cs' : '/api/run-ts';
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: userCode, input: tc.input })
        });
        const data = await res.json();
        if (!data.success) {
          allPassed = false;
          resultMessage += `【NG】入力: ${tc.input}\nエラー:\n${data.output}\n\n`;
        } else {
          const actual = String(data.output).trim();
          const expected = String(tc.output).trim();
          if (actual === expected) {
            resultMessage += `【OK】入力: ${tc.input}\n => ${actual}\n\n`;
          } else {
            allPassed = false;
            resultMessage += `【NG】入力: ${tc.input}\n 期待値: ${expected}, 実際: ${actual}\n\n`;
          }
        }
      } catch (error: any) {
        allPassed = false;
        resultMessage += `【ERR】${error.message}\n\n`;
      }
    }

    if (allPassed) {
      setOutput(`全テストケース合格！\n\n${resultMessage}`);
    } else {
      setOutput(`一部失敗:\n\n${resultMessage}`);
    }
  };

  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div style={{ marginBottom: '10px' }}>
        <label>使用言語: </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LangOption)}
        >
          <option value='csharp'>C#</option>
          <option value='typescript'>TypeScript</option>
        </select>
      </div>

      <CodeEditor code={userCode} onChange={setUserCode} language={language} />

      <div style={{ margin: '10px 0' }}>
        <label>テストケース: </label>
        <select
          value={sampleIndex}
          onChange={(e) => setSampleIndex(Number(e.target.value))}
        >
          {task.testCases.map((_, idx) => (
            <option key={idx} value={idx}>
              入力例{idx + 1}
            </option>
          ))}
        </select>

        <button className='btn' onClick={handleCompileAndTest}>
          提出前動作確認
        </button>
      </div>

      <button className='btn' onClick={handleSubmit}>
        コードを提出する
      </button>

      <div className='output'>{output}</div>
    </div>
  );
};

export default TaskRunner;
```

---

# 手順18: src/App.tsx

```tsx
import React, { useEffect, useState } from 'react';
import tasksData from './data/tasks.json';
import Timer from './components/Timer';
import TaskRunner from './components/TaskRunner';
import './styles/style.css';

function App() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [disqualified, setDisqualified] = useState(false);

  const currentTask = tasksData[currentTaskIndex];

  // タブがhiddenになったら失格
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setDisqualified(true);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const handleTimeUp = () => {
    setDisqualified(true);
  };

  if (!currentTask) {
    return (
      <div className='container'>
        課題データがありません。
      </div>
    );
  }

  if (disqualified) {
    return (
      <div className='container'>
        <div className='disqualified'>失格になりました...(タブが非アクティブ)</div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='title'>ローカル競プロ学習アプリ</div>

      <div className='timer'>
        <Timer totalSec={currentTask.timeLimitSec} onTimeUp={handleTimeUp} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <button
          className='btn'
          onClick={() => setCurrentTaskIndex((prev) => (prev + 1) % tasksData.length)}
        >
          次の課題へ
        </button>
      </div>

      <TaskRunner task={currentTask} />
    </div>
  );
}

export default App;
```

---

# 手順19: src/index.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

# 手順20: client/public/index.html を上書き

```html
<!DOCTYPE html>
<html lang='ja'>
<head>
  <meta charset='utf-8' />
  <title>Local Competitive App</title>
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
</head>
<body>
  <div id='root'></div>
</body>
</html>
```

---

# 手順21: インストール完了後の確認

現在、`my-competitive-app/client` フォルダ内に  
- `package.json`, `tsconfig.json`, `public/index.html`, `src/*`  
が配置されました。

---

# 手順22: 依存関係のインストール

```bash
# まず ルートに戻って
cd ..

# ルートで
npm install

# clientフォルダへ移動して
cd client
npm install

# ルートに戻る
cd ..
```

これで、  
- ルートの`package.json`に書いてある**サーバサイドの依存関係**(`express`, `concurrently`, `typescript` など)  
- `client/package.json`に書いてある**React + TypeScript**の依存関係  
がそれぞれインストールされます。

---

# 手順23: サーバ起動

```bash
# 1) ビルド
npm run server:build

# 2) 起動
npm run server:start
```

または、開発モードで同時実行するなら  
```bash
npm run dev
```
これで**サーバのTypeScript watch**と**クライアントのReact dev server**を同時に起動します。  

もし個別にやるなら、**別のターミナル**で

```bash
# ターミナル1
npm run server:dev  # サーバを監視ビルド+起動
```

```bash
# ターミナル2
npm run client:start # clientフォルダのReact dev server
```

---

# 手順24: ブラウザでアクセス

- サーバ: `http://localhost:4000`  
- クライアント: `http://localhost:3000` (CRAのデフォルトポート)

ブラウザで `http://localhost:3000` を開くと、  
「ローカル競プロ学習アプリ」というタイトルのページが表示され、  
現在の課題( tasks.json の最初の課題 )、Timer、コードエディタなどが現れます。

1. **エディタ**でC# または TypeScript のコードを入力  
2. 「提出前動作確認」で選択したテストケースを1回だけ実行  
3. 「コードを提出する」で複数テストケースをまとめて実行  
4. **タブを切り替える**（他のタブを開くなど）と**失格**扱い  
5. **制限時間を超過**しても失格になる

---

# 補足

- **Windows向け**に `csc` を使っています。  
  - **Mac / Linux** の場合、`.NET SDK` や `Mono` をインストールし、`mcs` や `dotnet new console` → `dotnet run` などへ書き換える必要があります。  
- **TypeScriptコンパイラ** (`tsc`) はグローバルにインストールされ、 `tsc` コマンドが通る状態を想定しています。  
  - 通っていない場合は `npm install -g typescript` 等で入れるか、 `npx tsc` に書き換える方法もあります。  
- **絶対にインターネットに公開しない**ようにしてください。任意コード実行のリスクがあります。

---

# まとめ

上記の**コマンド＋ファイル配置手順**を1つずつ実施すると、  
**「1つのプロジェクト」で競技プログラミング風UIを備えたアプリ**が手元に完成します。  

- **サーバ(Express + TypeScript)**: `server/` で C# / TS をコンパイル＆実行（child_process）  
- **クライアント(React + TypeScript)**: `client/` で課題情報・Timer・タブ切り替え検知・テストケース判定などを実装  
- **npm run dev** で**同時起動**し、ブラウザで `http://localhost:3000` を開けばOK  

これで**「可不足なく」**、「フォルダ構成」「必要コマンド」「ファイルの中身」をすべて揃えた**完成手順**となります。