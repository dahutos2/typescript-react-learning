# 競技プログラミング勉強アプリ

---

# フォルダ構成

最終的に作られるフォルダ構成は次の通りです。

```
my-competitive-app/
  ├─ package.json          
  ├─ tsconfig.json
  ├─ code-analysis-server/ 
  │   ├─ code-analysis-server.sln.ts     
  │   ├─ CodeAnalysisServer/
  │   │   ├─ Api/
  │   │   │   ├─ Enums/
  │   │   │   │   └─ CodeCheckSeverity.cs
  │   │   │   ├─ Interfaces/
  │   │   │   │   ├─ IAssemblyProvider.cs
  │   │   │   │   ├─ ICodeCheckProvider.cs
  │   │   │   │   ├─ ICodeFixProvider.cs
  │   │   │   │   ├─ ICompletionProvider.cs
  │   │   │   │   ├─ IHoverInformationProvider.cs
  │   │   │   │   ├─ IRequest.cs
  │   │   │   │   ├─ IResponse.cs
  │   │   │   │   ├─ ISignatureHelpProvider.cs
  │   │   │   │   └─ ITabCompletionProvider.cs
  │   │   │   ├─ Requests/
  │   │   │   │   ├─ CodeCheckRequest.cs
  │   │   │   │   ├─ CodeFixRequest.cs
  │   │   │   │   ├─ CompletionRequest.cs
  │   │   │   │   ├─ HoverInfoRequest.cs
  │   │   │   │   ├─ SignatureHelpRequest.cs
  │   │   │   │   └─ TabCompletionRequest.cs
  │   │   │   └─ Responses/
  │   │   │       ├─ CodeCheckResult.cs
  │   │   │       ├─ CodeFixResult.cs
  │   │   │       ├─ CompletionResult.cs
  │   │   │       ├─ HoverInfoResult.cs
  │   │   │       ├─ SignatureHelpResult.cs
  │   │   │       └─ TabCompletionResult.cs
  │   │   ├─ Controllers/
  │   │   │   ├─ CSharpCodeFixController.cs
  │   │   │   ├─ CSharpCompleteController.cs
  │   │   │   ├─ CSharpDiagnoseController.cs
  │   │   │   ├─ CSharpHoverController.cs
  │   │   │   ├─ CSharpSignatureHelpController.cs
  │   │   │   └─ CSharpTabCompletionController.cs
  │   │   ├─ Properties/
  │   │   │   └─ launchSettings.json
  │   │   ├─ Services/
  │   │   │   ├─ AssemblyProvider.cs
  │   │   │   ├─ CodeCheckProvider.cs
  │   │   │   ├─ CodeFixProvider.cs
  │   │   │   ├─ CompletionProvider.cs
  │   │   │   ├─ HoverInfoBuilder.cs
  │   │   │   ├─ HoverInformationProvider.cs
  │   │   │   ├─ InvocationContext.cs
  │   │   │   ├─ SignatureHelpProvider.cs
  │   │   │   └─ TabCompletionProvider.cs
  │   │   ├─ Workspaces/
  │   │   │   └─ CompletionWorkspace.cs
  │   │   ├─ appsettings.Development.json
  │   │   ├─ appsettings.json
  │   │   ├─ CodeAnalysisServer.csproj
  │   │   ├─ CodeAnalysisServer.http
  │   │   └─ Program.cs
  ├─ server/
  │   ├─ server.ts         
  │   ├─ runCode.ts  
  │   ├─ types.ts
  │   └─ tsconfig.json
  ├─ client/
  │   ├─ package.json
  │   ├─ tsconfig.json
  │   ├─ public/
  │   │   └─ index.html
  │   └─ src/
  │       ├─ App.module.css
  │       ├─ App.tsx
  │       ├─ global.d.ts
  │       ├─ index.css
  │       ├─ index.tsx
  │       ├─ data/
  │       │   ├─ defaultCodes.json
  │       │   ├─ practiceTasks.json
  │       │   └─ tasks.json
  │       ├─ styles/
  │       │   ├─ globals.css
  │       │   └─ variables.css
  │       ├─ utils/
  │       │   └─ types.ts
  │       └─ components/
  │               ├─ CodeEditor/
  │               │   ├─ index.tsx
  │               │   ├─ CodeEditor.module.css
  │               │   ├─ csharpLogic.ts
  │               │   └─ typescriptLogic.ts
  │               ├─ CompletionScreen/
  │               │   ├─ index.tsx
  │               │   └─ CompletionScreen.module.css
  │               ├─ Login/
  │               │   ├─ index.tsx
  │               │   └─ Login.module.css
  │               ├─ PreSubmitConfirmation/
  │               │   ├─ index.tsx
  │               │   └─ PreSubmitConfirmation.module.css
  │               ├─ shared/
  │               │   ├─ Button.tsx
  │               │   └─ Button.module.css
  │               ├─ TaskRunner/
  │               │   ├─ index.tsx
  │               │   └─ TaskRunner.module.css
  │               └─ Timer/
  │                   ├─ index.tsx
  │                   └─ Timer.module.css
  ├─ temp/
  └─ results/
```

---

# 手順1: フォルダを作成し、移動する

```bash
# 好きな場所でフォルダを作成
mkdir my-competitive-app
cd my-competitive-app
```

---

# 手順2: `package.json (ルート)` を作成

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
    "client:build": "cd client && npm run build",
    "client:dev": "cd client && npm start",
    "client:release": "cd client && npx serve -s build -l 3000",
    "analysis:dev": "cd code-analysis-server/CodeAnalysisServer && dotnet run",
    "analysis:build": "cd code-analysis-server/CodeAnalysisServer && dotnet build -c Release",
    "analysis:release": "cd code-analysis-server/CodeAnalysisServer && dotnet run -c Release",
    "dev": "concurrently \"npm run analysis:dev\" \"npm run server:dev\" \"npm run client:dev\"",
    "build": "npm run server:build && npm run client:build && npm run analysis:build",
    "release": "concurrently \"npm run analysis:release\" \"npm run server:start\" \"npm run client:release\""
  },
  "dependencies": {
    "axios": "^1.7.9",
    "concurrently": "^7.6.0",
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.14",
    "@types/node": "^18.15.0",
    "nodemon": "^3.1.9",
    "typescript": "^4.9.0"
  }
}
```

---

# 手順3: `tsconfig.json (ルート)` を作る (空ファイルでもOK)

```bash
# ルートに tsconfig.json を作る
echo "{}" > tsconfig.json
```

（またはテキストエディタで `tsconfig.json` を開いて `{}` と書くだけでもOK）

---

# 手順4: `server` フォルダを作成 & 移動

```bash
mkdir server
cd server
```

---

# 手順5: `server` フォルダ内のファイルを作成

各ファイルを作成し、以下の内容を記述します。

## tsconfig.json

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
  "include": [
    "./**/*.ts"
  ]
}
```

---

## server.ts

```ts
import express from 'express';
import {
  runCsCode,
  runTsCode,
  initializeUser,
  disqualifyUser,
  getUserState,
  getResult,
} from './runCode';
import cors from 'cors';
import path from 'path';
import axios from 'axios';

const app = express();
const PORT = 4000;

// CORS設定（必要に応じて調整）
app.use(cors());

// JSONパースミドルウェア
app.use(express.json());

// 静的ファイルの提供（必要に応じて）
app.use(express.static(path.join(__dirname, '../../client/build')));

// ログインエンドポイント
app.post('/api/login', (req, res) => {
  const { userId, mode, timeLimitSec } = req.body;
  if (!userId || !mode || (mode === 'task' && !timeLimitSec)) {
    return res.status(400).json({ success: false, output: 'userId, mode, および task モードの場合は timeLimitSec が必要です。' });
  }
  initializeUser(userId, mode, timeLimitSec);
  res.json({ success: true });
});

// ユーザー状態取得エンドポイント
app.get('/api/user-state', (req, res) => {
  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ success: false, output: 'userIdが必要です。' });
  }
  const userState = getUserState(userId);
  if (!userState) {
    return res.status(404).json({ success: false, output: 'ユーザーが見つかりません。' });
  }

  let remainingTime: number | undefined = undefined;

  if (userState.mode === 'task' && userState.taskStartTime && userState.timeLimitSec) {
    const elapsed = Math.floor((Date.now() - userState.taskStartTime) / 1000);
    remainingTime = userState.timeLimitSec - elapsed;

    if (remainingTime <= 0 && !userState.disqualified) {
      disqualifyUser(userId);
      remainingTime = 0;
    }
  }

  res.json({ success: true, userState: { ...userState, remainingTime } });
});

// 失格エンドポイント
app.post('/api/disqualify', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, output: 'userIdが必要です。' });
  }
  disqualifyUser(userId);
  res.json({ success: true });
});

// 結果取得エンドポイント
app.get('/api/get-result', async (req, res) => {
  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ success: false, output: 'userIdが必要です。' });
  }

  try {
    const result = await getResult(userId);
    res.json({ success: true, output: result });
  } catch (error: any) {
    res.status(500).json({ success: false, output: error.message });
  }
});

// C#コード実行エンドポイント（isSubmitパラメータを受け取る）
app.post('/api/run-cs', async (req, res) => {
  const { code, testCases, userId, isSubmit } = req.body;
  if (!userId || !testCases || !Array.isArray(testCases)) {
    return res.status(400).json({ success: false, output: 'userIdと複数のtestCasesが必要です。' });
  }
  try {
    const testCaseResults = await runCsCode(code, testCases, userId, isSubmit);
    res.json({ success: true, output: testCaseResults });
  } catch (error: any) {
    res.json({ success: false, output: error.message });
  }
});

// TypeScriptコード実行エンドポイント
app.post('/api/run-ts', async (req, res) => {
  const { code, testCases, userId, isSubmit } = req.body;
  if (!userId || !testCases || !Array.isArray(testCases)) {
    return res.status(400).json({ success: false, output: 'userIdと複数のtestCasesが必要です。' });
  }
  try {
    const testCaseResults = await runTsCode(code, testCases, userId, isSubmit);
    res.json({ success: true, output: testCaseResults });
  } catch (error: any) {
    res.json({ success: false, output: error.message });
  }
});

// モード切り替えエンドポイント
app.post('/api/switch-mode', (req, res) => {
  const { userId, timeLimitSec } = req.body;
  if (!userId || !timeLimitSec) {
    return res.status(400).json({ success: false, output: 'userIdとtimeLimitSecが必要です。' });
  }
  const userState = getUserState(userId);
  if (!userState) {
    return res.status(404).json({ success: false, output: 'ユーザーが見つかりません。' });
  }
  userState.mode = 'task';
  // 既に remainingTime が設定されている場合は上書きしない
  if (userState.taskStartTime === undefined) {
    userState.taskStartTime = Date.now();
    userState.timeLimitSec = timeLimitSec;
  }
  res.json({ success: true, output: '本番モードに切り替えました。' });
});

// C#サーバーのURL
const CSHARP_SERVER_URL = 'http://127.0.0.1:6000/api/csharp';

// プロキシ関数
const proxyRequest = async (req: express.Request, res: express.Response, endpoint: string) => {
  try {
    const url = `${CSHARP_SERVER_URL}/${endpoint}`;
    const axiosResponse = await axios({
      method: req.method,
      url,
      headers: { 'Content-Type': 'application/json' },
      data: req.body
    });

    // axiosが status >= 400 なら例外を投げるため、ここに来る段階で成功ステータス
    const data = axiosResponse.data;
    res.json(data);

  } catch (error: any) {
    // axiosが4xx/5xxを検知した場合もここに入る
    console.error(`エンドポイント ${endpoint} でエラーが発生しました:`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
app.post('/api/csharp-complete', (req, res) => proxyRequest(req, res, 'complete'));
app.post('/api/csharp-diagnose', (req, res) => proxyRequest(req, res, 'diagnose'));
app.post('/api/csharp-hover', (req, res) => proxyRequest(req, res, 'hover'));
app.post('/api/csharp-signatureHelp', (req, res) => proxyRequest(req, res, 'signatureHelp'));
app.post('/api/csharp-tabCompletion', (req, res) => proxyRequest(req, res, 'tabCompletion'));
app.post('/api/csharp-codefix', (req, res) => proxyRequest(req, res, 'codefix'));

// 全てのルートをReactアプリにフォワード
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
```

---

## runCode.ts

```ts
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { UserState, TaskMode, CommandError, TestCaseResult, TestCase } from './types';

const tempDir = path.join(__dirname, '../../temp');
const resultDir = path.join(__dirname, '../../results');

// tempDirとresultDirが存在しない場合は作成
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
if (!fs.existsSync(resultDir)) {
  fs.mkdirSync(resultDir, { recursive: true });
}

const userStates: { [userId: string]: UserState } = {};

// ユーザーの初期化
export function initializeUser(userId: string, mode: TaskMode, timeLimitSec?: number): void {
  if (!userStates[userId]) {
    userStates[userId] = {
      disqualified: false,
      completed: false,
      mode,
      taskStartTime: mode === 'task' ? Date.now() : undefined,
      timeLimitSec: mode === 'task' && timeLimitSec ? timeLimitSec : undefined,
    };
  } else {
    userStates[userId].mode = mode;
  }
}

// ユーザーの失格状態を更新
export function disqualifyUser(userId: string): void {
  const userState = userStates[userId];
  if (userState && userState.mode === 'task') {
    userState.disqualified = true;
    writeResultToFile(userId, '失格');
  }
}

// ユーザー状態の取得
export function getUserState(userId: string): UserState | null {
  return userStates[userId] || null;
}

// ユーザーの完了状態を更新
function completeUser(userId: string): void {
  const userState = userStates[userId];
  if (userState && userState.mode === 'task') {
    userState.completed = true;
    writeResultToFile(userId, '提出完了');
  }
}

// ユーザー結果をファイルに書き込む関数
function writeResultToFile(userId: string, result: string): void {
  const filePath = path.join(resultDir, `${userId}.txt`);
  const timestamp = new Date().toISOString();
  const content = `結果: ${result}\n日時: ${timestamp}\n`;
  fs.appendFileSync(filePath, content, 'utf8');
}

// テストケースごとの結果を保存する関数
function saveTestCaseResults(userId: string, testCaseResults: TestCaseResult[]): void {
  const filePath = path.join(resultDir, `${userId}_test_results.json`);
  fs.writeFileSync(filePath, JSON.stringify(testCaseResults, null, 2), 'utf8');
}

// ユーザーの検証と残り時間の更新
function validateUser(userId: string): void {
  const userState = userStates[userId];
  if (!userState) {
    throw new Error('ユーザーが初期化されていません。');
  }

  if (userState.mode === 'task') {
    if (userState.disqualified) {
      throw new Error('ユーザーは失格状態です。');
    }

    // 残り時間のチェック
    if (userState.taskStartTime && userState.timeLimitSec !== undefined) {
      const elapsed = Math.floor((Date.now() - userState.taskStartTime) / 1000);
      const timeLeft = userState.timeLimitSec - elapsed;
      if (timeLeft <= 0) {
        disqualifyUser(userId);
        throw new Error('時間切れで失格しました。');
      }
    }
  }
}

function sanitizeOutput(output: string): string {
  // ファイルパスのマッチ（ディレクトリ区切り文字を必須）
  const pathRegex = /(?:[A-Za-z]:\\|\/|\.{1,2}[\\/])(?:[\w.-]+[\\/])+[\w.-]+\.\w+/g;

  // ソースコードの行番号のマッチ
  const lineNumberRegex = /in .*?:line \d+/g;

  // パスと行番号をそれぞれ置換
  let sanitizedOutput = output.replace(pathRegex, '[PATH]');
  sanitizedOutput = sanitizedOutput.replace(lineNumberRegex, '[LINE INFO]');

  return sanitizedOutput.trim();
}

function normalizeOutput(output: string): string {
  return output
    .replace(/\r\n/g, '\n') // 改行コードを統一
    .trim(); // 両端の空白を削除
}

// -------------------------------------------------------------------------
// コマンド実行ロジック
// -------------------------------------------------------------------------

/**
 * コマンドを実行し、標準出力と標準エラーを取得する。
 * 
 * @param cmd 実行コマンド
 * @param args コマンド引数
 * @param cwd カレントディレクトリ
 * @param input 標準入力に書き込む内容
 * @param enableTimeout 実行時にタイムアウトをかけるか (ビルド時は false, 実行時は true)
 * @param timeoutMs タイムアウトまでのミリ秒 (デフォルトは 15000ms)
 */
function executeCommand(
  cmd: string,
  args: string[],
  cwd: string,
  input?: string,
  // タイムアウト機能を有効にするフラグ、デフォルト無効
  enableTimeout: boolean = false,
  // タイムアウト時間 (ms)
  timeoutMs: number = 15000
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, shell: true });

    let stdout = '';
    let stderr = '';

    let isTimeout = false;

    // タイムアウトを設定するかどうか
    let timeoutId: NodeJS.Timeout | null = null;
    if (enableTimeout) {
      timeoutId = setTimeout(() => {
        // タイムアウト時に子プロセスを強制終了
        isTimeout = true;
        child.kill('SIGTERM');
      }, timeoutMs);
    }

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(
        new CommandError(
          `コマンド実行エラー: ${sanitizeOutput(error.message)}`,
          sanitizeOutput(stdout),
          sanitizeOutput(stderr),
        )
      );
    });

    child.on('close', (code) => {
      if (timeoutId) clearTimeout(timeoutId);
      const sanitizedStdout = sanitizeOutput(stdout);
      const sanitizedStderr = sanitizeOutput(stderr);

      if (code !== 0) {
        let timeOutText = '';
        if (isTimeout) {
          timeOutText = '実行時間が15秒を超えたため強制終了しました。';
        }
        reject(
          new CommandError(
            `コマンドが非正常終了しました。終了コード: ${code}`,
            `${timeOutText}${sanitizedStdout}`,
            `${timeOutText}${sanitizedStderr}`,
          )
        );
      } else {
        resolve({
          stdout: sanitizedStdout,
          stderr: sanitizedStderr,
        });
      }
    });

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
}

// -------------------------------------------------------------------------
// .NET関係
// -------------------------------------------------------------------------

// プロジェクトの初期化
async function initializeCsProject(projectDir: string, userId: string): Promise<void> {
  try {
    await executeCommand('dotnet', ['new', 'console', '-o', `Project_${userId}`], path.dirname(projectDir));
  } catch (error: any) {
    throw new Error(`.NET プロジェクトの初期化エラー:\n${error.stderr || error.message}`);
  }
}

// C#コードのビルド
async function buildCsProject(projectDir: string, userId: string): Promise<void> {
  try {
    const buildResult = await executeCommand('dotnet', ['build', '-c', 'Release'], projectDir);
    if (buildResult.stderr) {
      // 警告のみをサーバー側でログに記録
      console.warn(`Build stderr for user ${userId}: ${buildResult.stderr}`);
    }
  } catch (error: any) {
    if (error instanceof CommandError) {
      console.error(`C#ビルドエラー for user ${userId}: ${error.stderr}`);
      throw new Error(`C#ビルドエラーが発生しました。\n${error.stderr}`);
    } else {
      throw new Error(`C#ビルドエラーが発生しました。\n${error.message}`);
    }
  }
}

// C#プロジェクトの実行
async function runCsProject(projectDir: string, userId: string, input: string): Promise<string> {
  const projectFilePath = path.join(projectDir, `Project_${userId}.csproj`);
  const runArgs = ['run', '--no-build', '-c', 'Release', '--project', projectFilePath];
  try {
    const runResult = await executeCommand('dotnet', runArgs, projectDir, input, true);
    if (runResult.stderr) {
      console.error(`Run stderr for user ${userId}: ${runResult.stderr}`);
    }
    return runResult.stdout;
  } catch (error: any) {
    if (error instanceof CommandError) {
      console.error(`C#実行エラー for user ${userId}: ${error.stderr}`);
      throw new Error(`C#実行エラーが発生しました。\n${error.stderr}`);
    } else {
      throw new Error(`C#実行エラーが発生しました。\n${error.message}`);
    }
  }
}

// C#コードのコンパイルと実行
export async function runCsCode(
  code: string,
  testCases: TestCase[],
  userId: string,
  isSubmit: boolean = false
): Promise<TestCaseResult[]> {
  validateUser(userId);

  const userState = userStates[userId];
  const projectDir = path.join(tempDir, `Project_${userId}`);

  // プロジェクトディレクトリの存在確認と初期化
  if (!fs.existsSync(projectDir)) {
    await initializeCsProject(projectDir, userId);
  }

  // Program.cs の書き換え
  const programCsPath = path.join(projectDir, 'Program.cs');
  fs.writeFileSync(programCsPath, code, 'utf8');

  // ビルド
  await buildCsProject(projectDir, userId);

  // 実行（テストケースごとに実行）
  const testCaseResults: TestCaseResult[] = [];
  for (const tc of testCases) {
    try {
      const output = await runCsProject(projectDir, userId, tc.input);
      const success = normalizeOutput(output) === normalizeOutput(tc.expectedOutput);
      testCaseResults.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: output,
        status: success ? 'success' : 'failure',
        isPublic: tc.isPublic
      });
    } catch (error: any) {
      testCaseResults.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: error.message,
        status: 'error',
        isPublic: tc.isPublic
      });
    }
  }

  if (isSubmit && userState.mode === 'task') {
    completeUser(userId);
  }
  if (isSubmit) {
    // テストケース結果を保存
    saveTestCaseResults(userId, testCaseResults);
    return [];
  }

  return testCaseResults;
}

// -------------------------------------------------------------------------
// TypeScript関係
// -------------------------------------------------------------------------

// TypeScriptコードのコンパイルと実行
export async function runTsCode(
  code: string,
  testCases: TestCase[],
  userId: string,
  isSubmit: boolean = false
): Promise<TestCaseResult[]> {
  validateUser(userId);

  const userState = userStates[userId];
  const tsFilePath = path.join(tempDir, `temp_${userId}.ts`);
  const jsFilePath = path.join(tempDir, `temp_${userId}.js`);

  // TypeScript ファイルの保存
  fs.writeFileSync(tsFilePath, code, 'utf8');

  // コンパイル
  try {
    const compileResult = await executeCommand('tsc', [tsFilePath, '--outDir', tempDir], tempDir);
    if (compileResult.stderr) {
      console.warn(`TypeScript Build warnings for user ${userId}: ${compileResult.stderr}`);
    }
  } catch (compileError: any) {
    if (compileError instanceof CommandError) {
      console.error(`TypeScriptコンパイルエラー for user ${userId}: ${compileError.stderr}`);
      throw new Error(`TypeScriptコンパイルエラーが発生しました。\n${compileError.stderr}`);
    } else {
      throw new Error(`TypeScriptコンパイルエラーが発生しました。\n${compileError.message}`);
    }
  }

  // 実行（テストケースごとに実行）
  const testCaseResults: TestCaseResult[] = [];
  for (const tc of testCases) {
    try {
      const runResult = await executeCommand('node', [jsFilePath], tempDir, tc.input, true);
      const output = runResult.stdout;
      const success = normalizeOutput(output) === normalizeOutput(tc.expectedOutput);
      testCaseResults.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: output,
        status: success ? 'success' : 'failure',
        isPublic: tc.isPublic
      });
    } catch (runError: any) {
      testCaseResults.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: runError.message,
        status: 'error',
        isPublic: tc.isPublic
      });
    }
  }

  if (isSubmit && userState.mode === 'task') {
    completeUser(userId);
  }
  if (isSubmit) {
    // テストケース結果を保存
    saveTestCaseResults(userId, testCaseResults);
    return [];
  }

  return testCaseResults;
}

// 提出結果の取得
export async function getResult(userId: string): Promise<TestCaseResult[]> {
  const testResultPath = path.join(resultDir, `${userId}_test_results.json`);
  let testCaseResults: TestCaseResult[] = [];
  if (fs.existsSync(testResultPath)) {
    const testContent = fs.readFileSync(testResultPath, 'utf8');
    testCaseResults = JSON.parse(testContent);
  }

  return testCaseResults;
}
```

---

## types.ts

```ts
export type TaskMode = 'task' | 'practice';
export type LangOption = 'csharp' | 'typescript';
export type OutputStatus = 'error' | 'failure' | 'success';

// テストケース
export interface TestCase {
    input: string;
    expectedOutput: string;
    isPublic: boolean;
}

// テストケースの結果
export interface TestCaseResult {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    status: OutputStatus;
    isPublic: boolean;
}

// ユーザーごとのタスク管理
export interface UserState {
    disqualified: boolean;
    completed: boolean;
    mode: TaskMode;
    taskStartTime?: number; // タスク開始時刻（ミリ秒）
    timeLimitSec?: number;  // タスクの制限時間（秒）
}

export class CommandError extends Error {
    public stdout: string;
    public stderr: string;

    constructor(message: string, stdout: string, stderr: string) {
        super(message);
        this.stdout = stdout;
        this.stderr = stderr;
        Object.setPrototypeOf(this, CommandError.prototype);
    }
}
```

---

# 手順6: `server` フォルダ作成完了。戻る

```bash
cd ..
```

これで `my-competitive-app/server/` 下に  
- `tsconfig.json`  
- `server.ts`  
- `runCode.ts` 
- `types.ts`  
が揃いました。

---

# 手順7: `temp` フォルダを作る

```bash
mkdir temp
```

---

# 手順8: `results` フォルダを作る

```bash
mkdir results
```

---

# 手順9: `client` フォルダを作り、Reactをセットアップ

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
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^28.1.1",
    "@types/node": "^18.7.14",
    "@types/react": "^18.0.18",
    "@types/react-dom": "^18.0.6",
    "lodash.debounce": "^4.0.8",
    "monaco-editor": "^0.52.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "^5.0.1",
    "typescript": "^4.9.3",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:4000",
  "devDependencies": {
    "@types/lodash.debounce": "^4.0.9"
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
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx"
    },
    "include": [
        "src/**/*"
    ],
    "exclude": [
        "node_modules"
    ]
}
```

---

# 手順10: 必要なフォルダとファイルの作成

```bash
cd client
mkdir -p src/data
mkdir -p src/styles
mkdir -p src/utils
mkdir -p src/components/CodeEditor
mkdir -p src/components/CompletionScreen
mkdir -p src/components/Login
mkdir -p src/components/PreSubmitConfirmation
mkdir -p src/components/shared
mkdir -p src/components/TaskRunner
mkdir -p src/components/Timer
```

---

# 手順11: `client/src/data` フォルダ内のファイルを作成

各ファイルを作成し、以下の内容を記述します。

## defaultCodes.json

```jsonc
{
    "csharp": "using System;\n\npublic class Program {\n    public static void Main() {\n        string input = Console.ReadLine();\n        Console.WriteLine(input);\n    }\n}",
    "typescript": "const input = require('fs').readFileSync(0, 'utf8').trim() as string;\nconsole.log(input);"
}
```

---

## practiceTasks.json

```jsonc
[
    {
        "id": 1,
        "title": "練習問題: 文字列の反転",
        "description": [
            "入力された文字列を反転して出力してください。"
        ],
        "inputDescription": [],
        "outputDescription": [],
        "timeLimitSec": 1800,
        "testCases": [
            {
                "input": "hello",
                "output": "olleh",
                "isPublic": true
            },
            {
                "input": "Thank you",
                "output": "uoy knahT",
                "isPublic": true
            }
        ]
    }
]
```

---

## tasks.json

```jsonc
// 省略
```

---

# 手順12: `client/src/styles` フォルダ内のファイルを作成

各ファイルを作成し、以下の内容を記述します。

## globals.css

```css
@import './variables.css';

/* リセットCSS */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: var(--background-color);
    font-family: var(--font-family);
    color: var(--text-color);
}

pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.title {
    text-align: center;
    font-size: 2em;
    margin-bottom: 20px;
    color: var(--text-color);
}

.disqualified {
    color: var(--error-color);
    font-size: 1.2em;
    margin-bottom: 20px;
}

.timer {
    text-align: center;
    margin-bottom: 20px;
}

/* Quick Fixのデザイン */
.monaco-editor .context-view .action-widget {
    font-size: 7px;
}

.monaco-editor .context-view .action-widget .monaco-list-rows .monaco-list-row.action {
    width: auto;
    min-width: 300px;
}

.monaco-editor .context-view .action-widget .monaco-list-rows .monaco-list-row.action .title {
    color: inherit;
    text-align: left;
    display: inline-block;
    margin: 0 auto;
}
```

---

## variables.css

```css
:root {
    --primary-color: #007bff;
    --primary-hover: #0056b3;
    --secondary-color: #6c757d;
    --secondary-hover: #5a6268;
    --disabled-color: grey;
    --background-color: #f8f9fa;
    --text-color: #333;
    --font-family: 'Arial', sans-serif;
    --error-color: red;
}
```

---

# 手順13: `client/src/utils/types.ts` を作成

```ts
export type TaskMode = 'task' | 'practice';
export type LangOption = 'csharp' | 'typescript';
export type OutputStatus = 'error' | 'failure' | 'success';

export interface Config {
    taskIndex: number;
}

export interface TestCase {
    input: string;
    output: string;
    isPublic: boolean;
}

export interface Task {
    id: number;
    title: string;
    description: string[];
    inputDescription: string[];
    outputDescription: string[];
    timeLimitSec: number;
    testCases: TestCase[];
}

export interface TestCaseResult {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    status: OutputStatus;
    isPublic: boolean;
}

export interface OverallResult {
    overallMessage: string;
    testCaseResults: TestCaseResult[];
}
```

---

# 手順14: `client/src/components` フォルダ内のファイルを作成

各ファイルを作成し、以下の内容を記述します。

## CodeEditor/index.tsx

```tsx
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

    // Editor内でコピーしたテキストを保持するための変数
    const lastEditorCopiedText = useRef<string | null>(null);
    const isLineCopyRef = useRef<boolean | null>(null);

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
        tabCompletion: 'on',
        contextmenu: false,
        scrollbar: { alwaysConsumeMouseWheel: false },
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

        // monaco-editorのKeyコードは以下になる
        // https://microsoft.github.io/monaco-editor/typedoc/enums/KeyCode.html
        // C: 33、S: 49、V: 52、X: 54
        const KeyC = 33, KeyS = 49, KeyV = 52, KeyX = 54;

        /**
         * Editor内でコピー／カットされたテキストを記録する
         */
        const handleCopyOrCut = () => {
            const selection = editor.getSelection();
            if (!selection) return;
            const model = editor.getModel();
            if (!model) return;

            let copiedText = '';
            if (selection.isEmpty()) {
                // 行コピー/行カット
                const lineNumber = selection.startLineNumber;
                const lineContent = model.getLineContent(lineNumber);
                isLineCopyRef.current = true;
                copiedText = `${lineContent}\n`;
            } else {
                // 通常の選択範囲
                isLineCopyRef.current = false;
                copiedText = model.getValueInRange(selection);
            }
            lastEditorCopiedText.current = copiedText;
        }

        /**
         * 「Editor 内コピーだけ貼り付け可能」にする貼り付け処理
         * - 行コピーの場合は「現在の行に挿入」してカーソルを最後へ移動
         * - 範囲コピーの場合は現在の選択範囲を上書きし、カーソルを末尾へ
         */
        const handlePaste = async () => {
            try {
                // クリップボード文字列を取得 & 改行コードを LF(\n) に統一
                let clipText = await navigator.clipboard.readText();
                clipText = clipText.replace(/\r\n/g, '\n');

                // Editor 内コピーと一致しなければ、
                if (clipText !== lastEditorCopiedText.current) {
                    window.dispatchEvent(new CustomEvent('monaco-editor-paste'));
                    return;
                }

                // 選択範囲(= カーソル情報)が無い場合は何もせず終了
                const selection = editor.getSelection();
                if (!selection) return;

                // 行コピー or 通常コピーで分岐
                if (isLineCopyRef.current) {
                    // ---- 行コピーの場合 ----
                    const lineNumber = selection.startLineNumber;

                    // 挿入先: (lineNumber, col=1) の位置に clipText を差し込む
                    // ※ ここで "行を押し下げる" 挙動
                    const insertPos = new monacoEditor.Range(
                        lineNumber, 1,
                        lineNumber, 1
                    );

                    // テキストの行数・最終行の文字長を算出
                    let lines = clipText.split('\n');
                    if (lines[lines.length - 1] === '') {
                        // 最終行が空文字列(末尾改行)の場合は pop
                        lines.pop();
                    }
                    const lineCount = lines.length;
                    const lastLineLen = lines[lineCount - 1].length;

                    // 貼り付け後のカーソル位置を、挿入した最終行の末尾に設定
                    editor.executeEdits(
                        null,
                        [
                            {
                                range: insertPos,
                                text: clipText,
                                forceMoveMarkers: true
                            }
                        ],
                        [
                            // 貼り付け後のカーソル位置 (最後の行末尾)
                            new monacoEditor.Selection(
                                lineNumber + lineCount,
                                lastLineLen + 1,
                                lineNumber + lineCount,
                                lastLineLen + 1
                            )
                        ]
                    );
                } else {
                    // ---- 通常の範囲コピーの場合 ----
                    // 選択範囲を上書きし、その末尾にカーソルを移動
                    let lines = clipText.split('\n');
                    if (lines[lines.length - 1] === '') {
                        lines.pop();
                    }
                    const lineCount = lines.length;
                    const lastLineLen = lines[lineCount - 1].length;

                    const { startLineNumber, startColumn } = selection;
                    const endLine = startLineNumber + (lineCount - 1);

                    // 単一行 or 複数行でカーソル末尾の計算が変わる
                    const endColumn = (lineCount === 1)
                        ? (startColumn + lastLineLen)
                        : (lastLineLen + 1);

                    editor.executeEdits(
                        null,
                        [
                            {
                                range: selection,
                                text: clipText,
                                forceMoveMarkers: true
                            }
                        ],
                        [
                            new monacoEditor.Selection(
                                endLine,
                                endColumn,
                                endLine,
                                endColumn
                            )
                        ]
                    );
                }
            } catch (err) {
                console.warn('Clipboard read failed:', err);
            }
        }

        // Ctrl/Cmd + C / V / S / X をフック
        editor.onKeyDown(async (event) => {
            // “Ctrl/Cmd が押されていなければ” 早期 return
            if (!event.ctrlKey && !event.metaKey) return;

            switch (event.keyCode) {
                case KeyC:
                case KeyX:
                    handleCopyOrCut();
                    break;

                case KeyS:
                    // 保存ショートカットをブロック
                    event.preventDefault();
                    break;

                case KeyV:
                    // 一旦標準の貼り付けをブロック
                    event.preventDefault();
                    await handlePaste();
                    break;

                default:
                    // それ以外は何もしない
                    break;
            }
        });
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
```

---

## CodeEditor/CodeEditor.module.css

```css
/* エディタ全体のコンテナ */
.editorContainer {
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* ヘッダ部分 */
.editorHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px;
}

/* タイトル表示など */
.editorTitle {
    font-size: 1.2em;
    font-weight: bold;
}

/* ボタン類のラッパ */
.editorControls {
    display: flex;
    gap: 8px;
}

/* ボディ部分、実際にエディタを表示する領域 */
.editorBody {
    flex: 1;
    height: 400px;
    position: relative;
}
```

---

## CodeEditor/csharpLogic.ts

```ts
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

        const DOC_BASE_URL = 'https://learn.microsoft.com/ja-jp/dotnet/csharp/misc/';

        // エラーと警告を統合し、それぞれに対応するseverityを設定
        const combinedMarkers = [
            ...errors.map((err: any) => ({ ...err, severity: monacoEditor.MarkerSeverity.Error })),
            ...warnings.map((warn: any) => ({ ...warn, severity: monacoEditor.MarkerSeverity.Warning })),
        ];

        // マーカーの生成
        const newMarkers: monacoEditor.editor.IMarkerData[] = combinedMarkers.map((marker: any) => ({
            severity: marker.severity,
            startLineNumber: marker.line,
            startColumn: marker.character,
            endLineNumber: marker.line,
            endColumn: marker.character + 1,
            message: marker.message,
            code: {
                value: marker.id,
                target: monaco.Uri.parse(`${DOC_BASE_URL}${marker.id}`),
            },
        }));

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

                    // メイン編集の範囲を算出
                    const main = item.mainTextChange;
                    if (!main.newText) return null;
                    const startPos = model.getPositionAt(main.start);
                    const endPos = model.getPositionAt(main.end);
                    const mainRange = new monaco.Range(
                        startPos.lineNumber, startPos.column,
                        endPos.lineNumber, endPos.column
                    );
                    // 追加編集の範囲を算出
                    const additionalTextEdits: monacoEditor.languages.TextEdit[] = [];
                    if (Array.isArray(item.additionalTextChanges)) {
                        item.additionalTextChanges.forEach((tc: any) => {
                            const s = model.getPositionAt(tc.start);
                            const e = model.getPositionAt(tc.end);
                            additionalTextEdits.push({
                                range: new monaco.Range(s.lineNumber, s.column, e.lineNumber, e.column),
                                text: tc.newText
                            });
                        });
                    }
                    // 複数変更ありの場合は、追加編集のみを行う
                    const isMulti = additionalTextEdits.length > 1;
                    const pos = model.getPositionAt(cursorPosition);
                    const additionalRange = new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column);
                    const suggestion: monacoEditor.languages.CompletionItem = {
                        label: item.label,
                        kind: kindEnum,
                        detail: item.detail || '',
                        insertText: isMulti ? '' : main.newText,
                        range: isMulti ? additionalRange : mainRange,
                        additionalTextEdits: isMulti ? additionalTextEdits : undefined,
                    };

                    // スニペット候補の場合は、余分なインデントが付加されるのを防ぐ
                    if (kindEnum === monaco.languages.CompletionItemKind.Snippet) {
                        suggestion.insertTextRules =
                            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet |
                            monaco.languages.CompletionItemInsertTextRule.KeepWhitespace;
                    }

                    return suggestion;
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
            const code = model.getValue();
            const position = model.getOffsetAt(range.getStartPosition());

            // 診断情報を取得
            const diagnostics = context.markers
                .filter(marker =>
                    (marker.severity === monaco.MarkerSeverity.Warning ||
                        marker.severity === monaco.MarkerSeverity.Error) &&
                    range.startLineNumber === marker.startLineNumber &&
                    range.startColumn === marker.startColumn &&
                    range.endLineNumber === marker.endLineNumber &&
                    range.endColumn === marker.endColumn
                );

            if (diagnostics.length === 0) {
                return {
                    actions: [],
                    dispose: () => { }
                };
            }

            try {
                // 診断情報をまとめて送信
                const res = await fetch('/api/csharp-codefix', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, code, position: position }),
                });

                if (!res.ok) {
                    throw new Error(`C#CodeFixサーバーエラー: ${res.statusText}`);
                }

                interface CodeFix {
                    diagnostic: string;
                    title: string;
                    text: string;
                    range: {
                        startLineNumber: number;
                        startColumn: number;
                        endLineNumber: number;
                        endColumn: number;
                    };
                }
                const data: { fixes: CodeFix[] } = await res.json();
                if (!data.fixes || data.fixes.length === 0) {
                    return {
                        actions: [],
                        dispose: () => { }
                    };
                }

                const actions: monacoEditor.languages.CodeAction[] = [];
                const appliedFixes = new Set<string>();

                for (const diagnostic of diagnostics) {
                    // 現在の診断に対応する修正のみを抽出
                    const fixesForDiagnostic = data.fixes.filter(fix => fix.diagnostic === diagnostic.message);
                    for (const fix of fixesForDiagnostic) {
                        const fixIdentifier = `${fix.text}-${fix.diagnostic}`;
                        if (appliedFixes.has(fixIdentifier)) {
                            continue; // 同じ修正はスキップ
                        }
                        appliedFixes.add(fixIdentifier);

                        actions.push({
                            title: fix.title,
                            edit: {
                                edits: [
                                    {
                                        resource: model.uri,
                                        textEdit: {
                                            range: new monaco.Range(
                                                fix.range.startLineNumber,
                                                fix.range.startColumn,
                                                fix.range.endLineNumber,
                                                fix.range.endColumn
                                            ),
                                            text: fix.text,
                                        },
                                        versionId: model.getVersionId()
                                    }
                                ],
                            },
                            diagnostics: [diagnostic],
                            kind: 'quickfix'
                        });
                    }
                }

                return {
                    actions,
                    dispose: () => { }
                };
            } catch (error) {
                console.error('C#CodeFixリクエスト失敗:', error);
                return {
                    actions: [],
                    dispose: () => { }
                };
            }
        }
    });
}
```

---

## CodeEditor/typescriptLogic.ts

```ts
import * as monacoEditor from 'monaco-editor';

/**
 * TypeScriptコンパイラオプションを設定する関数。
 * ハードコーディングは行わず、strictチェック等を標準で有効化。
 * @param monaco Monacoインスタンス
 */
export function setupTypeScriptDefaults(monaco: typeof monacoEditor) {
    // TypeScriptのコンパイラオプションを設定
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2019,
        allowNonTsExtensions: true,
        strict: true,
        noEmit: true,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        jsx: monaco.languages.typescript.JsxEmit.React,
    });
}

/**
 * TypeScript向けの各種Providerを登録する。
 * @param monaco MonacoEditor インスタンス
 */
export function registerTypeScriptProviders(monaco: typeof monacoEditor) {
    // --- CodeAction(QuickFix) Provider ---
    monaco.languages.registerCodeActionProvider('typescript', {
        /**
         * コードアクションを返すメソッド。
         */
        async provideCodeActions(model, range, context, token) {
            const actions: monacoEditor.languages.CodeAction[] = [];

            try {
                // TSワーカーを取得
                const workerGetter = await monaco.languages.typescript.getTypeScriptWorker();
                const worker = await workerGetter(model.uri);

                const fileName = model.uri.toString();

                // markers に対して Quick Fix を探す
                for (const marker of context.markers) {
                    if (!marker.code) {
                        continue;
                    }
                    // markerの行列を0-based offsetに変換
                    const startOffset = model.getOffsetAt({
                        lineNumber: marker.startLineNumber,
                        column: marker.startColumn
                    });
                    const endOffset = model.getOffsetAt({
                        lineNumber: marker.endLineNumber,
                        column: marker.endColumn
                    });

                    // marker.code が string か numberか分からないので Number()で変換
                    const errorCode = Number(marker.code);
                    const codeFixes = await worker.getCodeFixesAtPosition(
                        fileName,
                        startOffset,
                        endOffset,
                        [errorCode],
                        {},
                    );

                    // 取得した CodeFixAction を Monaco CodeAction 形式に変換
                    for (const fix of codeFixes) {
                        // fix.changes: FileTextChanges[]
                        //  -> それぞれの textChanges を IWorkspaceTextEdit に変換する
                        const allEdits: (monacoEditor.languages.IWorkspaceTextEdit | monacoEditor.languages.IWorkspaceFileEdit)[] = [];

                        for (const change of fix.changes) {
                            // "change" の型を (ts.FileTextChanges) として扱うなら import type { FileTextChanges } from 'typescript'
                            const resource = monacoEditor.Uri.parse(change.fileName);

                            for (const tc of change.textChanges) {
                                // 0-based offset => Monaco Range
                                const startPos = model.getPositionAt(tc.span.start);
                                const endPos = model.getPositionAt(tc.span.start + tc.span.length);

                                const text: monacoEditor.languages.IWorkspaceTextEdit = {
                                    resource,
                                    textEdit: {
                                        range: new monacoEditor.Range(
                                            startPos.lineNumber,
                                            startPos.column,
                                            endPos.lineNumber,
                                            endPos.column
                                        ),
                                        text: tc.newText,
                                    },
                                    versionId: tc.id
                                };
                                allEdits.push(text);
                            }
                        }

                        actions.push({
                            title: fix.description,
                            diagnostics: [marker],
                            edit: {
                                edits: allEdits
                            },
                            kind: 'quickfix',
                            // fixMissingImportを優先
                            isPreferred: fix.fixId === 'fixMissingImport'
                        });
                    }
                }
            } catch (error) {
                console.error('TypeScript QuickFix取得失敗:', error);
            }

            return {
                actions,
                dispose() { }
            };
        }
    });
}
```

---

## CompletionScreen/index.tsx

```tsx
import React, { useEffect, useState } from 'react';
import { TaskMode, TestCaseResult, OverallResult, OutputStatus } from '../../utils/types';
import styles from './CompletionScreen.module.css';
import Button from '../shared/Button';

interface CompletionScreenProps {
    userId: string;
    mode: TaskMode;
    switchModeToTask: () => void;
    onInComplete: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ userId, mode, switchModeToTask, onInComplete }) => {
    const [result, setResult] = useState<OverallResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await fetch(`/api/get-result?userId=${encodeURIComponent(userId)}`);
                const data = await response.json();
                if (data.success) {
                    const testCaseResults: TestCaseResult[] = data.output;
                    setResult({ overallMessage: '提出が完了しました！', testCaseResults: testCaseResults });
                } else {
                    setResult({ overallMessage: '結果の取得に失敗しました。', testCaseResults: [] });
                }
            } catch (error) {
                setResult({ overallMessage: '結果の取得中にエラーが発生しました。', testCaseResults: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [userId]);

    const getStatusStyle = (status: OutputStatus): string => {
        switch (status) {
            case 'success':
                return styles.resultSuccess;
            case 'failure':
                return styles.resultFailure;
            case 'error':
                return styles.resultError;
            default:
                return '';
        }
    };
    const getStatusMessage = (status: OutputStatus): string => {
        switch (status) {
            case 'success':
                return '成功';
            case 'failure':
                return '失敗';
            case 'error':
                return 'エラー';
            default:
                return '';
        }
    };
    const toTask = () => {
        onInComplete();
        switchModeToTask();
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>提出完了</h2>
            {loading ? (
                <div className={styles.loading}>結果を取得中...</div>
            ) : (
                <div className={styles.resultContainer}>
                    <div className={styles.overallResult}>
                        <strong>総合結果:</strong>
                        <p>{result?.overallMessage}</p>
                    </div>
                    {result?.testCaseResults && result.testCaseResults.length > 0 && (
                        <div className={styles.testCaseResults}>
                            {result.testCaseResults.map((tcResult, index) => (
                                <div key={`${tcResult.input}-${index}`} className={styles.testCaseResult}>
                                    <div className={styles.resultHeader}>
                                        <strong>テストケース {index + 1}:</strong>
                                        <span className={getStatusStyle(tcResult.status)}>
                                            {getStatusMessage(tcResult.status)}
                                        </span>
                                    </div>
                                    <div className={styles.resultRow}>
                                        <span className={styles.label}>入力:</span>
                                        <pre className={styles.content}>{tcResult.input}</pre>
                                    </div>
                                    <div className={styles.resultRow}>
                                        <span className={styles.label}>期待出力:</span>
                                        <pre className={styles.content}>{tcResult.expectedOutput}</pre>
                                    </div>
                                    <div className={styles.resultRow}>
                                        <span className={styles.label}>実際の出力:</span>
                                        <pre className={styles.content}>{tcResult.actualOutput}</pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className={styles.buttonGroup}>
                {mode === 'practice' && (
                    <Button onClick={toTask} variant="primary" className={styles.button}>
                        本番モードに切り替える
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CompletionScreen;
```

---

## CompletionScreen/CompletionScreen.module.css

```css
.container {
    width: 100%;
    max-width: 800px;
    margin: 50px auto;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    text-align: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
    font-size: 2.5em;
    color: #2c3e50;
    margin-bottom: 20px;
    font-weight: bold;
}

.loading {
    font-size: 1.5em;
    color: #555555;
    margin-bottom: 20px;
}

.resultContainer {
    text-align: left;
    margin-bottom: 30px;
}

.overallResult {
    background-color: #eafaf1;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid #b2d8b2;
}

.testCaseResults {
    background-color: #f0f8ff;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
}

.testCaseResult {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ececec;
}

.testCaseResult:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.resultHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.resultSuccess {
    color: #2ecc71;
    font-weight: bold;
}

.resultFailure {
    color: #e74c3c;
    font-weight: bold;
}

.resultError {
    color: #e67e22;
    font-weight: bold;
}

.resultRow {
    display: flex;
    margin-bottom: 10px;
    align-items: flex-start;
}

.label {
    flex: 0 0 120px;
    font-weight: bold;
    color: #2c3e50;
}

.content {
    flex: 1;
    white-space: pre-wrap;
    /* 改行を適用 */
    word-wrap: break-word;
    /* 長い文字列を折り返す */
    font-family: 'Courier New', Courier, monospace;
    background-color: #f9f9f9;
    padding: 8px;
    border-radius: 6px;
    margin-left: 10px;
    color: #34495e;
}

.buttonGroup {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.button {
    padding: 14px 30px;
    font-size: 1.1em;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    background-color: #27ae60;
    color: #ffffff;
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button:hover:not(:disabled) {
    background-color: #1e8449;
    transform: translateY(-3px);
}

.button:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
}
```

---

## Login/index.tsx

```tsx
import React, { useState } from 'react';
import styles from './Login.module.css';
import Button from '../shared/Button';
import { TaskMode } from '../../utils/types';

interface LoginProps {
    onLogin: (userId: string, mode: TaskMode) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [userIdInput, setUserIdInput] = useState('');
    const [error, setError] = useState('');

    const isInputValid = userIdInput.trim() !== '';

    const handleLogin = (selectedMode: TaskMode) => {
        if (isInputValid) {
            onLogin(userIdInput.trim(), selectedMode);
        } else {
            setError('ユーザーIDを入力してください。');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.loginTitle}>ようこそ！</h2>

            <div className={styles.noticeContainer}>
                <p>
                    【注意事項】
                    <br />
                    ・本番中は他の画面から、入力エリアに対してペーストすると<strong>失格</strong>となります。
                    <br />
                    ・入力エリア以外のコピー操作なども<strong>失格</strong>の対象です。
                    <br />
                    ・誤って操作して失格にならないようご注意ください。
                </p>
            </div>

            <input
                type="text"
                placeholder="ユーザーIDを入力してください"
                value={userIdInput}
                onChange={(e) => {
                    setUserIdInput(e.target.value);
                    if (e.target.value.trim() !== '') {
                        setError('');
                    }
                }}
                className={styles.userIdInput}
                aria-label="ユーザーID"
            />
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.buttonGroup}>
                <Button onClick={() => handleLogin('task')} disabled={!isInputValid} variant="primary">
                    本番を開始する
                </Button>
                <Button onClick={() => handleLogin('practice')} disabled={!isInputValid} variant="secondary">
                    練習問題を解く
                </Button>
            </div>
        </div>
    );
};

export default Login;
```

---

## Login/Login.module.css

```css
.loginContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: var(--background-color);
    padding: 20px;
}

.loginTitle {
    margin-bottom: 20px;
    color: var(--text-color);
    font-size: 2em;
}

.userIdInput {
    width: 300px;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1em;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.userIdInput:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.errorMessage {
    color: var(--error-color);
    margin-bottom: 10px;
    font-size: 0.9em;
}

.buttonGroup {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.noticeContainer {
    width: 680px;
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 20px;
    font-size: 0.9em;
    color: #856404;
    line-height: 1.4;
}

@media (max-width: 600px) {
    .userIdInput {
        width: 80%;
    }

    .buttonGroup {
        width: 80%;
    }

    .noticeContainer {
        width: 80%;
    }
}
```

---

## PreSubmitConfirmation/index.tsx

```tsx
import React from 'react';
import { OutputStatus } from '../../utils/types';
import styles from './PreSubmitConfirmation.module.css';

interface PreSubmitConfirmationProps {
    status: OutputStatus;
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    errorMessages?: string;
}

const statusIcons: Record<OutputStatus, string> = {
    error: '❌',
    failure: '⚠️',
    success: '✔️',
};

const statusMessages: Record<OutputStatus, string> = {
    error: 'コード実行結果: エラー',
    failure: 'コード実行結果: 不正解',
    success: 'コード実行結果: 正解',
};

const PreSubmitConfirmation: React.FC<PreSubmitConfirmationProps> = ({
    status,
    input,
    expectedOutput,
    actualOutput,
    errorMessages,
}) => {
    const statusStyle = `codeResult--${status}`;
    return (
        <div className={`${styles.codeResult} ${styles[statusStyle]}`}>
            <div className={styles.judgeResult}>
                <span className={styles.statusIcon}>{statusIcons[status]}</span>
                {statusMessages[status]}
            </div>
            <div className={styles.resultRow}>
                <span className={styles.label}>入力:</span>
                <pre className={styles.content}>{input}</pre>
            </div>
            <div className={styles.resultRow}>
                <span className={styles.label}>期待出力:</span>
                <pre className={styles.content}>{expectedOutput}</pre>
            </div>
            <div className={styles.resultRow}>
                <span className={styles.label}>実際の出力:</span>
                <pre className={styles.content}>{actualOutput || '出力がありません'}</pre>
            </div>
            {status === 'error' && errorMessages && (
                <div className={styles.errorMessages}>
                    <strong>エラー詳細:</strong>
                    <pre>{errorMessages}</pre>
                </div>
            )}
            {status === 'failure' && (
                <div className={styles.hint}>
                    期待する出力と出力結果が異なります。半角スペースや改行の違いに注意してください。
                </div>
            )}
        </div>
    );
};

export default PreSubmitConfirmation;
```

---

## PreSubmitConfirmation/PreSubmitConfirmation.module.css

```css
/* 全体のスタイリング */
.codeResult {
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
}

/* 状態ごとのスタイリング */
.codeResult--error {
    border-color: #e74c3c;
    background-color: #fdecea;
}

.codeResult--failure {
    border-color: #e67e22;
    background-color: #fff5e6;
}

.codeResult--success {
    border-color: #2ecc71;
    background-color: #eafaf1;
}

/* 判定結果のスタイリング */
.judgeResult {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 1.5rem;
    color: #34495e;
    margin-bottom: 20px;
}

.statusIcon {
    margin-right: 10px;
    font-size: 1.8rem;
}

/* ボックス内のスタイリング */
.resultRow {
    display: flex;
    margin-bottom: 15px;
    align-items: flex-start;
}

.label {
    flex: 0 0 100px;
    font-weight: bold;
    color: #2c3e50;
}

.content {
    flex: 1;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Courier New', Courier, monospace;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 6px;
    color: #34495e;
}

/* エラー詳細 */
.errorMessages {
    margin-top: 20px;
    padding: 15px;
    background-color: #fdecea;
    border-left: 4px solid #e74c3c;
    border-radius: 6px;
    color: #c0392b;
    font-size: 0.95rem;
}

/* ヒントエリア */
.hint {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff8d1;
    border-left: 4px solid #ffeb99;
    border-radius: 6px;
    font-size: 0.95rem;
    color: #856404;
}
```

---

## shared/Button.tsx

```tsx
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled = false, variant = 'primary', className = '' }) => {
    const classNames = `${styles.btn} ${variant === 'secondary' ? styles.btnSecondary : styles.btnPrimary} ${disabled ? styles.disabled : ''} ${className}`;
    return (
        <button className={classNames} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
```

---

## shared/Button.module.css

```css
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-sizing: border-box;
    text-align: center;
}

.btnPrimary {
    background-color: var(--primary-color);
    color: white;
}

.btnPrimary:hover:not(.disabled) {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
}

.btnSecondary {
    background-color: var(--secondary-color);
    color: white;
}

.btnSecondary:hover:not(.disabled) {
    background-color: var(--secondary-hover);
    transform: translateY(-2px);
}

.disabled {
    background-color: var(--disabled-color);
    cursor: not-allowed;
    opacity: 0.6;
}

.btn:focus {
    outline: 2px solid var(--primary-hover);
    outline-offset: 2px;
}
```

---

## TaskRunner/index.tsx

```tsx
import React, { useState, useEffect } from 'react';
import CodeEditor from '../CodeEditor';
import PreSubmitConfirmation from '../PreSubmitConfirmation';
import { Task, TaskMode, LangOption, TestCaseResult, OutputStatus } from '../../utils/types';
import defaultCodes from '../../data/defaultCodes.json';
import styles from './TaskRunner.module.css';
import Button from '../shared/Button';

interface TaskRunnerProps {
    task: Task;
    userId: string;
    mode: TaskMode;
    switchModeToTask: () => void;
    onComplete: () => void;
}

const TaskRunner: React.FC<TaskRunnerProps> = ({ task, userId, mode, switchModeToTask, onComplete }) => {
    const [language, setLanguage] = useState<LangOption>('csharp');
    const [userCode, setUserCode] = useState('');
    const [sampleIndex, setSampleIndex] = useState(0);
    const [isTesting, setIsTesting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 提出前動作確認用の状態
    const [preSubmitStatus, setPreSubmitStatus] = useState<OutputStatus | null>(null);
    const [preSubmitInput, setPreSubmitInput] = useState('');
    const [preSubmitExpectedOutput, setPreSubmitExpectedOutput] = useState('');
    const [preSubmitActualOutput, setPreSubmitActualOutput] = useState('');
    const [preSubmitErrorMessages, setPreSubmitErrorMessages] = useState('');

    const publicTestCases = task.testCases.filter((tc) => tc.isPublic);

    useEffect(() => {
        // 言語が変更された際にデフォルトのコードを設定し、プレテスト結果をクリア
        setUserCode(defaultCodes[language]);
        setPreSubmitStatus(null);
    }, [language]);

    // 提出前の単一テストケース実行
    const handlePreSubmit = async () => {
        const selectedTestCase = publicTestCases[sampleIndex];
        if (!selectedTestCase) {
            setPreSubmitStatus('error');
            setPreSubmitActualOutput('');
            setPreSubmitErrorMessages('テストケースが選択されていません');
        }
        try {
            const testCases = [{
                input: selectedTestCase.input,
                expectedOutput: selectedTestCase.output,
                isPublic: selectedTestCase.isPublic
            }];

            const url = language === 'csharp' ? '/api/run-cs' : '/api/run-ts';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: userCode,
                    testCases: testCases,
                    userId: userId,
                    isSubmit: false
                })
            });
            const data = await res.json();
            setPreSubmitInput(selectedTestCase.input);
            setPreSubmitExpectedOutput(selectedTestCase.output);
            if (!data.success) {
                // エラー発生時
                setPreSubmitStatus('error');
                setPreSubmitActualOutput('');
                setPreSubmitErrorMessages(data.output);
            } else {
                const testCaseResults: TestCaseResult[] = data.output;
                if (testCaseResults.length !== 1) {
                    setPreSubmitStatus('error');
                    setPreSubmitActualOutput('');
                    setPreSubmitErrorMessages('データが不正です');
                } else {
                    const testCaseResult = testCaseResults[0];
                    setPreSubmitStatus(testCaseResult.status);
                    if (testCaseResult.status === 'error') {
                        setPreSubmitActualOutput('');
                        setPreSubmitErrorMessages(testCaseResult.actualOutput);
                    } else {
                        setPreSubmitActualOutput(testCaseResult.actualOutput);
                    }
                }
            }
        } catch (error: any) {
            // 通信エラー
            setPreSubmitStatus('error');
            setPreSubmitInput(selectedTestCase.input);
            setPreSubmitExpectedOutput(selectedTestCase.output);
            setPreSubmitActualOutput('');
            setPreSubmitErrorMessages(error.message);
        }
    };

    // 提出時のテストケース実行
    const executeAllTestCases = async (): Promise<void> => {
        try {
            const testCases = task.testCases.map(tc => {
                return {
                    input: tc.input,
                    expectedOutput: tc.output,
                    isPublic: tc.isPublic
                };
            });
            const url = language === 'csharp' ? '/api/run-cs' : '/api/run-ts';
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: userCode,
                    testCases: testCases,
                    userId: userId,
                    isSubmit: true
                })
            });
        } catch (error: any) {
            // 例外時は何もしない
        }
    };

    const handleTestRun = async () => {
        setIsTesting(true);
        await handlePreSubmit();
        setIsTesting(false);
    };
    const handleSubmit = async () => {
        setIsSubmitting(true);
        await executeAllTestCases();
        onComplete();
        setIsSubmitting(false);
    };

    const toTask = () => {
        setPreSubmitStatus(null);
        switchModeToTask();
    }

    const renderWithCodeBlocks = (lines: string[]) => {
        const elements: JSX.Element[] = [];
        let codeBlock: string[] = [];
        let insideCodeBlock = false;
        lines.forEach((line, index) => {
            if (line === '<code>') {
                insideCodeBlock = true;
                codeBlock = [];
            } else if (line === '</code>') {
                insideCodeBlock = false;
                elements.push(
                    <div key={`${line}-${index}`} className={styles.codeBlock}>
                        {codeBlock.map((codeLine, codeIndex) => (
                            <pre key={`${codeLine}-${codeIndex}`}>
                                {codeLine}
                            </pre>
                        ))}
                    </div>
                );
            } else if (insideCodeBlock) {
                codeBlock.push(line);
            } else {
                elements.push(
                    <p key={`${line}-${index}`} className={styles.line}>
                        {line}
                    </p>
                );
            }
        });

        return elements;
    };

    return (
        <div className={styles.container}>
            {mode === 'practice' && (
                <Button onClick={toTask} variant="secondary" className={styles.switchButton}>
                    本番モードに切り替える
                </Button>
            )}

            <h3 className={styles.taskTitle}>{task.title}</h3>

            {/* 説明 */}
            {task.description && task.description.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.sectionContent}>
                        {renderWithCodeBlocks(task.description)}
                    </div>
                </div>
            )}


            {/* 入力される値 */}
            {task.inputDescription && task.inputDescription.length > 0 && (
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>入力される値</h4>
                    <div className={styles.sectionContent}>
                        {renderWithCodeBlocks(task.inputDescription)}
                    </div>
                </div>
            )}

            {/* 期待する出力 */}
            {task.outputDescription && task.outputDescription.length > 0 && (
                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>期待する出力</h4>
                    <div className={styles.sectionContent}>
                        {renderWithCodeBlocks(task.outputDescription)}
                    </div>
                </div>
            )}

            {/* テストケースの詳細表示 */}
            <div className={styles.testCaseDetails}>
                {publicTestCases.map((tc, index) => (
                    <div key={`${tc.input}-${index}`} className={styles.individualTestCase}>
                        <div>
                            <strong className={styles.testCaseTitle}>入力例{index + 1}:</strong>
                            <pre className={styles.testCasePre}>{tc.input}</pre>
                        </div>
                        <div>
                            <strong className={styles.testCaseTitle}>期待される出力:</strong>
                            <pre className={styles.testCasePre}>{tc.output}</pre>
                        </div>
                    </div>
                ))}
            </div>

            {/* 言語選択 */}
            <div className={styles.formGroup}>
                <label htmlFor="language-select">使用言語: </label>
                <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as LangOption)}
                    className={styles.select}
                >
                    <option value='csharp'>C#</option>
                    <option value='typescript'>TypeScript</option>
                </select>
            </div>

            {/* コードエディタ */}
            <CodeEditor
                key={language}
                userId={userId}
                initialCode={userCode}
                onCodeChange={setUserCode}
                language={language}
            />

            {/* 提出前動作確認エリア */}
            <div className={styles.compileTestArea}>
                <div className={styles.inputSelect}>
                    <label htmlFor="sample_input_no">動作確認で使うテストケースを選択</label>
                    <select
                        name="sample_input_no"
                        id="sample_input_no"
                        className={`${styles.select}`}
                        value={sampleIndex ?? ''}
                        onChange={(e) => {
                            setSampleIndex(Number(e.target.value));
                        }}
                    >
                        {publicTestCases.map((tc, index) => (
                            <option key={`${tc.input}-${index}`} value={index}>
                                入力例{index + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <Button
                    onClick={handleTestRun}
                    disabled={isSubmitting || isTesting || sampleIndex === null}
                    variant="secondary"
                    className={styles.submitButton}
                >
                    {isTesting ? '確認中...' : '提出前に動作確認する'}
                </Button>
            </div>

            {/* 提出前動作確認の結果表示 */}
            {preSubmitStatus && (
                <PreSubmitConfirmation
                    status={preSubmitStatus}
                    input={preSubmitInput}
                    expectedOutput={preSubmitExpectedOutput}
                    actualOutput={preSubmitActualOutput}
                    errorMessages={preSubmitErrorMessages}
                />
            )}

            {/* 提出ボタンを中央に配置 */}
            <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isTesting}
                variant="primary"
                className={styles.submitButton}
            >
                {isSubmitting ? '提出中...' : 'コードを提出する'}
            </Button>
        </div>
    );
};

export default TaskRunner;
```

---

## TaskRunner/TaskRunner.module.css

```css
/* 全体のコンテナ */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 25px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* モード切り替えボタン */
.switchButton {
    align-self: flex-end;
    margin-bottom: 10px;
}

/* タスクタイトル */
.taskTitle {
    font-size: 1.8em;
    color: #2c3e50;
    text-align: center;
}

/* タスク説明セクション */
.section {
    background-color: #fbfbfb;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    font-size: 1.1em;
    line-height: 1.6;
    color: #34495e;
}

.sectionTitle {
    font-size: 1.2em;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 10px;
}

.sectionContent {
    font-size: 1rem;
    line-height: 1.6;
}

.codeBlock {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    color: #34495e;
    white-space: pre-wrap;
    word-wrap: break-word;
}

/* フォームグループ */
.formGroup {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 25px;
}

.formGroup label {
    font-weight: bold;
    font-size: 1em;
    color: #2c3e50;
}

/* セレクトボックス */
.select {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1em;
    background-color: #fafafa;
    transition: border-color 0.3s ease;
}

.select:focus {
    border-color: #3498db;
    outline: none;
}

/* ボタン */
.button {
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover:not(:disabled) {
    transform: translateY(-2px);
}

.button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

/* テストケース詳細 */
.testCaseDetails {
    background-color: #ffffff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.individualTestCase {
    border: 1px solid #e0e0e0;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 20px;
    background-color: #fafafa;
}

.testCaseTitle {
    font-weight: bold;
    margin-bottom: 8px;
    color: #2c3e50;
}

.testCasePre {
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 0.95em;
    color: #34495e;
}

/* 提出前動作確認エリア */
.compileTestArea {
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 20px 0;
}

.inputSelect {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.inputSelect label {
    font-size: 1rem;
    font-weight: bold;
    color: #2c3e50;
}

/* 提出ボタン */
.submitButton {
    min-width: 300px;
    margin: 0 auto;
    padding: 12px 20px;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    color: #fff;
    border: none;
    border-radius: 6px;
}
```

---

## Timer/index.tsx

```tsx
import React, { useEffect, useState } from 'react';
import { TaskMode } from '../../utils/types';
import styles from './Timer.module.css';
import Button from '../shared/Button';

interface TimerProps {
    totalSec: number;
    onTimeUp: () => void;
    mode: TaskMode;
}

const Timer: React.FC<TimerProps> = ({ totalSec, onTimeUp, mode }) => {
    const [timeLeft, setTimeLeft] = useState(totalSec);

    useEffect(() => {
        setTimeLeft(totalSec);
    }, [totalSec]);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimeUp]);

    // タイマーのリセット機能
    const handleReset = () => {
        if (mode === 'practice') {
            setTimeLeft(totalSec);
        }
    };

    return (
        <div className={styles.timerContainer}>
            <div className={`${styles.timerDisplay} ${timeLeft <= 10 ? styles.timerWarning : ''}`}>
                残り時間: {timeLeft}秒
            </div>
            {mode === 'practice' && (
                <Button onClick={handleReset} variant="secondary">
                    リセット
                </Button>
            )}
        </div>
    );
};

export default Timer;
```

---

## Timer/Timer.module.css

```css
.timerContainer {
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: center;
}

.timerDisplay {
    font-size: 1.2em;
    font-weight: bold;
}

.timerWarning {
    color: red;
}
```

---

# 手順15: `client/src/App.tsx` を作成

```tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Config, TaskMode } from './utils/types';
import tasksData from './data/tasks.json';
import practiceTasksData from './data/practiceTasks.json';
import Timer from './components/Timer';
import TaskRunner from './components/TaskRunner';
import CompletionScreen from './components/CompletionScreen';
import Login from './components/Login';
import styles from './App.module.css';
import './styles/globals.css';

function App() {
  const [disqualified, setDisqualified] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<TaskMode | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetch('/config.json')
      .then(response => response.json())
      .then((data: Config) => {
        setConfig(data);
      })
      .catch(err => {
        console.error('Failed to load config.json', err);
      });
  }, []);

  const currentTask = mode === 'task' ? tasksData[config?.taskIndex ?? 0] : practiceTasksData[0];

  /**
   * 失格処理をまとめた関数
   * - stateが変わるたびに再生成されないよう useCallback を使用
   */
  const handleDisqualification = useCallback(() => {
    if (userId && mode === 'task' && !completed) {
      setDisqualified(true);
      fetch('/api/disqualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    }
  }, [userId, mode, completed]);

  // コピー操作が行われたときに失格
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      // もしコピーがMonacoEditor（.monaco-editor）内で発生した場合は失格にしない
      const target = e.target as HTMLElement | null;
      if (target?.closest('.monaco-editor')) {
        // MonacoEditor内でのコピーは許可
        return;
      }

      // それ以外（Monaco以外の場所でのコピー）は失格とする
      handleDisqualification();
    };

    document.addEventListener('copy', handleCopy);
    return () => {
      document.removeEventListener('copy', handleCopy);
    };
  }, [handleDisqualification]);

  // MonacoEditor から発行されるカスタムイベント 'monaco-editor-paste' を監視
  useEffect(() => {
    const handleMonacoPaste = () => {
      handleDisqualification();
    };

    window.addEventListener('monaco-editor-paste', handleMonacoPaste);
    return () => {
      window.removeEventListener('monaco-editor-paste', handleMonacoPaste);
    };
  }, [handleDisqualification]);

  const handleTimeUp = () => {
    setDisqualified(true);
    setRemainingTime(0);
    handleDisqualification();
  };

  const switchModeToTask = () => {
    const timeLimitSec = currentTask.timeLimitSec;
    fetch('/api/switch-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, timeLimitSec }),
    }).then(() => {
      setMode('task');
      setRemainingTime(timeLimitSec);
    });
  }

  const handleLogin = (newUserId: string, selectedMode: TaskMode) => {
    // タスクのtimeLimitSecを取得
    const timeLimitSec = selectedMode === 'task' ? currentTask.timeLimitSec : undefined;

    // サーバー側でユーザー状態を初期化
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: newUserId, mode: selectedMode, timeLimitSec }),
    }).then(() => {
      setUserId(newUserId);
      setMode(selectedMode);
      if (selectedMode === 'task' && timeLimitSec) {
        setRemainingTime(timeLimitSec);
      }
    });
  };

  // ログイン後にユーザー状態を取得
  useEffect(() => {
    if (userId && mode) {
      fetch(`/api/user-state?userId=${encodeURIComponent(userId)}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const { userState } = data;
            if (userState.disqualified) {
              setDisqualified(true);
            } else if (userState.completed) {
              setCompleted(true);
            } else if (userState.remainingTime !== undefined) {
              setRemainingTime(userState.remainingTime);
            }
          }
        });
    }
  }, [userId, mode]);

  if (!userId || !mode) {
    return <Login onLogin={handleLogin} />;
  }

  if (disqualified) {
    return (
      <div className={styles.container}>
        <div className={styles.disqualified}>失格になりました...</div>
      </div>
    );
  }

  if (completed) {
    return (
      <CompletionScreen
        userId={userId}
        mode={mode}
        onInComplete={() => setCompleted(false)}
        switchModeToTask={switchModeToTask}
      />
    );
  }

  return (
    <div className={styles.container}>
      {mode === 'task' && (
        <div className={styles.timer}>
          <Timer
            totalSec={remainingTime || currentTask.timeLimitSec}
            onTimeUp={handleTimeUp}
            mode={mode}
          />
        </div>
      )}

      <TaskRunner
        task={currentTask}
        userId={userId}
        mode={mode}
        switchModeToTask={switchModeToTask}
        onComplete={() => setCompleted(true)}
      />
    </div>
  );
}

export default App;

```

---

# 手順16: `client/src/App.module.css` を作成

```css
.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--background-color);
    min-height: 100vh;
    box-sizing: border-box;
}

.title {
    text-align: center;
    font-size: 3em;
    color: var(--text-color);
    margin-bottom: 40px;
    font-weight: bold;
}

.timer {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

.disqualified {
    font-size: 2em;
    color: var(--error-color);
    text-align: center;
    margin-top: 100px;
}
```

---

# 手順17: `client/src/global.d.ts` を作成

```ts
declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.sass' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.less' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.styl' {
    const classes: { [key: string]: string };
    export default classes;
}
```

---

# 手順18: `client/src/index.tsx` を作成

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

# 手順19: `client/src/index.css` を作成

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

---

# 手順20: `client/public/index.html` を作成

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

# 手順21: `client/public/config.json` を作成

```jsonc
{
    "taskIndex": 0
}
```

---

# 手順22: インストール完了後の確認

現在、`my-competitive-app/client` フォルダ内に  
- `package.json`, `tsconfig.json`, `public/index.html`, `src/*`  
が配置されました。

---

# 手順23: 依存関係のインストール

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

# 手順24: `code-analysis-server` プロジェクトの初期化

```bash
# ルートディレクトリに移動
cd my-competitive-app

# code-analysis-server フォルダを作成
mkdir code-analysis-server
cd code-analysis-server

# Web API プロジェクトを作成
dotnet new webapi -n CodeAnalysisServer
```

---

# 手順25: `code-analysis-server/CodeAnalysisServer/CodeAnalysisServer.csproj` の更新

`CodeAnalysisServer.csproj`を以下の内容に置き換えます。これは、必要なパッケージ参照を含むプロジェクトファイルです。

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <InvariantGlobalization>true</InvariantGlobalization>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp" Version="4.12.0" />
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp.Features" Version="4.12.0" />
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp.Workspaces" Version="4.12.0" />
    <PackageReference Include="Microsoft.CodeAnalysis.Workspaces.Common" Version="4.12.0" />
    <PackageReference Include="Microsoft.CodeAnalysis.Workspaces.MSBuild" Version="4.12.0" />
    <PackageReference Include="Microsoft.Extensions.Caching.Memory" Version="9.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
  </ItemGroup>

</Project>

```

---

# 手順26: ソリューションにプロジェクトを追加

```bash
# ルートディレクトリに戻る
cd ..

# ソリューションファイルが存在しない場合は作成
dotnet new sln -n CodeAnalysisServer

# プロジェクトをソリューションに追加
dotnet sln CodeAnalysisServer.sln add code-analysis-server/CodeAnalysisServer/CodeAnalysisServer.csproj
```

---

# 手順27: 必要なフォルダとファイルの作成

`CodeAnalysisServer`プロジェクト内に必要なフォルダ構造を作成します。

```bash
cd code-analysis-server/CodeAnalysisServer

# フォルダの作成
mkdir -p Api/Enums
mkdir -p Api/Interfaces
mkdir -p Api/Requests
mkdir -p Api/Responses
mkdir Controllers
mkdir Services
mkdir Workspace
```

---

# 手順28: `code-analysis-server/CodeAnalysisServer/Api/Enums/CodeCheckSeverity.cs` を作成

```cs
namespace CodeAnalysisServer.Api.Enums
{
    public enum CodeCheckSeverity
    {
        Unknown = 0,
        Hint = 1,
        Info = 2,
        Warning = 4,
        Error = 8
    }
}
```

---

# 手順29: `code-analysis-server/CodeAnalysisServer/Api/Interfaces` フォルダ内のインターフェースを作成

各インターフェースファイルを作成し、以下の内容を記述します。

## IAssemblyProvider.cs

```cs
using Microsoft.CodeAnalysis;

namespace CodeAnalysisServer.Api.Interfaces
{
    public interface IAssemblyProvider
    {
        List<MetadataReference> GetAssemblies();
    }
}

```

## ICodeCheckProvider.cs

```cs
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;

namespace CodeAnalysisServer.Api.Interfaces
{
    public interface ICodeCheckProvider
    {
        Task<CodeCheckResult[]> ProvideAsync(CodeCheckRequest request);
    }
}
```

## ICodeFixProvider.cs

```cs
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;

namespace CodeAnalysisServer.Api.Interfaces
{
    public interface ICodeFixProvider
    {
        Task<CodeFixResult[]> ProvideAsync(CodeFixRequest request);
    }
}
```

## ICompletionProvider.cs

```cs
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;

namespace CodeAnalysisServer.Api.Interfaces
{
    public interface ICompletionProvider
    {
        Task<CompletionResult[]> ProvideCompletionAsync(CompletionRequest request);
    }
}
```

## IHoverInformationProvider.cs

```cs
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;

namespace CodeAnalysisServer.Api.Interfaces
{
    public interface IHoverInformationProvider
    {
        Task<HoverInfoResult?> ProvideAsync(HoverInfoRequest request);
    }
}
```

## IRequest.cs

```cs
namespace CodeAnalysisServer.Api.Interfaces
{
    public interface IRequest
    {
    }
}
```

## IResponse.cs

```cs
namespace CodeAnalysisServer.Api.Interfaces
{
    public interface IResponse
    {
    }
}
```

## ISignatureHelpProvider.cs

```cs
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;

namespace CodeAnalysisServer.Api.Interfaces
{
    public interface ISignatureHelpProvider
    {
        Task<SignatureHelpResult?> ProvideAsync(SignatureHelpRequest request);
    }
}
```

## ITabCompletionProvider.cs

```cs
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;

namespace CodeAnalysisServer.Api.Interfaces
{
    public interface ITabCompletionProvider
    {
        Task<TabCompletionResult[]> ProvideAsync(TabCompletionRequest request);
    }
}
```

---

# 手順30: `code-analysis-server/CodeAnalysisServer/Api/Requests` フォルダ内のリクエストクラスを作成

各リクエストファイルを作成し、以下の内容を記述します。

## CodeCheckRequest.cs

```cs
namespace CodeAnalysisServer.Api.Requests
{
    public class CodeCheckRequest
    {
        public string Code { get; set; } = string.Empty;
    }
}
```

## CodeFixRequest.cs

```cs
namespace CodeAnalysisServer.Api.Requests
{
    public class CodeFixRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int Position { get; set; }
    }
}
```

## CompletionRequest.cs

```cs
namespace CodeAnalysisServer.Api.Requests
{
    public class CompletionRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int CursorPosition { get; set; }
    }
}
```

## HoverInfoRequest.cs

```cs
namespace CodeAnalysisServer.Api.Requests
{
    public class HoverInfoRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int Position { get; set; }
    }
}
```

## SignatureHelpRequest.cs

```cs
namespace CodeAnalysisServer.Api.Requests
{
    public class SignatureHelpRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int Position { get; set; }
    }
}
```

## TabCompletionRequest.cs

```cs
namespace CodeAnalysisServer.Api.Requests
{
    public class TabCompletionRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int Position { get; set; }
    }
}
```

---

# 手順31: `code-analysis-server/CodeAnalysisServer/Api/Responses` フォルダ内のレスポンスクラスを作成

各レスポンスファイルを作成し、以下の内容を記述します。

## CodeCheckResult.cs

```cs
using CodeAnalysisServer.Api.Enums;

namespace CodeAnalysisServer.Api.Responses
{
    public class CodeCheckResult
    {
        public string Id { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int Line { get; set; }
        public int Character { get; set; }
        public CodeCheckSeverity Severity { get; set; }
    }
}
```

## CodeFixResult.cs

```cs
namespace CodeAnalysisServer.Api.Responses
{
    public class CodeFixResult
    {
        public string Diagnostic { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public required Range Range { get; set; }
    }

    public class Range
    {
        public int StartLineNumber { get; set; }
        public int StartColumn { get; set; }
        public int EndLineNumber { get; set; }
        public int EndColumn { get; set; }
    }
}
```

## CompletionResult.cs

```cs
namespace CodeAnalysisServer.Api.Responses
{
    public class CompletionResult
    {
        public string Label { get; set; } = string.Empty;
        public string Kind { get; set; } = string.Empty;
        public string Detail { get; set; } = string.Empty;
        public TextChangeDto? MainTextChange { get; set; }
        public TextChangeDto[] AdditionalTextChanges { get; set; } = [];
    }

    public class TextChangeDto
    {
        public int Start { get; set; }
        public int End { get; set; }
        public string? NewText { get; set; }
    }
}
```

## HoverInfoResult.cs

```cs
namespace CodeAnalysisServer.Api.Responses
{
    public class HoverInfoResult
    {
        public string Information { get; set; } = string.Empty;
    }
}
```

## SignatureHelpResult.cs

```cs
namespace CodeAnalysisServer.Api.Responses
{
    public class SignatureHelpResult
    {
        public Signature[] Signatures { get; set; } = [];
        public int ActiveSignature { get; set; }
        public int ActiveParameter { get; set; }
    }

    public class Signature
    {
        public string Label { get; set; } = string.Empty;
        public string Documentation { get; set; } = string.Empty;
        public Parameter[] Parameters { get; set; } = [];
    }

    public class Parameter
    {
        public string Label { get; set; } = string.Empty;
        public string Documentation { get; set; } = string.Empty;
    }
}
```

## TabCompletionResult.cs

```cs
namespace CodeAnalysisServer.Api.Responses
{
    public class TabCompletionResult
    {
        public string Suggestion { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
```

---

# 手順32: `code-analysis-server/CodeAnalysisServer/Controllers` フォルダ内のコントローラーを作成

各コントローラーファイルを作成し、以下の内容を記述します。

## CSharpCodeFixController.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using Microsoft.AspNetCore.Mvc;

namespace CodeAnalysisServer.Controllers
{
    [ApiController]
    [Route("api/csharp")]
    public class CSharpCodeFixController : ControllerBase
    {
        private readonly ICodeFixProvider _codeFixProvider;

        public CSharpCodeFixController(ICodeFixProvider codeFixProvider)
        {
            _codeFixProvider = codeFixProvider;
        }

        // POST: /api/csharp/codefix
        [HttpPost("codefix")]
        public async Task<IActionResult> CodeFix([FromBody] CodeFixRequest request)
        {
            if (string.IsNullOrEmpty(request.Code))
            {
                return BadRequest(new { message = "Code is null or empty." });
            }

            if (request.Position < 0 || request.Position > request.Code.Length)
            {
                return BadRequest(new { message = "Position is out of range." });
            }

            try
            {
                var fixes = await _codeFixProvider.ProvideAsync(request);
                if (fixes.Length == 0)
                {
                    return Ok(new { fixes = Array.Empty<object>() });
                }
                return Ok(new { fixes });
            }
            catch (Exception ex)
            {
                // ログにエラーを記録
                Console.WriteLine($"Error in CodeFix: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }
    }
}
```

## CSharpCompleteController.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace CodeAnalysisServer.Controllers
{
    [ApiController]
    [Route("api/csharp")]
    public class CSharpCompleteController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly ICompletionProvider _completionProvider;

        public CSharpCompleteController(IMemoryCache cache, ICompletionProvider completionProvider)
        {
            _cache = cache;
            _completionProvider = completionProvider;
        }

        // /api/csharp/complete
        [HttpPost("complete")]
        public async Task<IActionResult> Complete([FromBody] CompletionRequest request)
        {
            if (request.Code is null) // nullable 対策
            {
                return BadRequest(new { message = "Code is null." });
            }

            if (request.CursorPosition < 0 || request.CursorPosition > request.Code.Length)
            {
                return BadRequest(new { message = "カーソル位置がコードの範囲外です。" });
            }

            var cacheKey = $"{request.UserId}_{request.Code}_{request.CursorPosition}_complete";
            if (_cache.TryGetValue(cacheKey, out CompletionResult[]? cachedCompletions))
            {
                return Ok(new { suggestions = cachedCompletions });
            }

            var completions = await _completionProvider.ProvideCompletionAsync(request);
            if (completions.Length == 0)
            {
                return Ok(new { suggestions = Array.Empty<CompletionResult>() });
            }

            _cache.Set(cacheKey, completions, TimeSpan.FromMinutes(5));
            return Ok(new { suggestions = completions });
        }
    }
}
```

## CSharpDiagnoseController.cs

```cs
using CodeAnalysisServer.Api.Enums;
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using Microsoft.AspNetCore.Mvc;

namespace CodeAnalysisServer.Controllers
{
    [ApiController]
    [Route("api/csharp")]
    public class CSharpDiagnoseController : ControllerBase
    {
        private readonly ICodeCheckProvider _codeCheckProvider;

        public CSharpDiagnoseController(ICodeCheckProvider codeCheckProvider)
        {
            _codeCheckProvider = codeCheckProvider;
        }

        // /api/csharp/diagnose
        [HttpPost("diagnose")]
        public async Task<IActionResult> Diagnose([FromBody] CodeCheckRequest request)
        {
            if (request.Code is null)
            {
                return BadRequest(new { message = "Code is null." });
            }

            var diagnostics = await _codeCheckProvider.ProvideAsync(request);

            var errors = diagnostics
                .Where(d => d.Severity == CodeCheckSeverity.Error)
                .Select(d => new
                {
                    id = d.Id,
                    message = d.Message,
                    line = d.Line,
                    character = d.Character
                })
                .ToArray();

            var warnings = diagnostics
                .Where(d => d.Severity == CodeCheckSeverity.Warning)
                .Select(d => new
                {
                    id = d.Id,
                    message = d.Message,
                    line = d.Line,
                    character = d.Character
                })
                .ToArray();

            return Ok(new { errors, warnings });
        }
    }
}
```

## CSharpHoverController.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using Microsoft.AspNetCore.Mvc;

namespace CodeAnalysisServer.Controllers
{
    [ApiController]
    [Route("api/csharp")]
    public class CSharpHoverController : ControllerBase
    {
        private readonly IHoverInformationProvider _hoverInfoProvider;

        public CSharpHoverController(IHoverInformationProvider hoverInfoProvider)
        {
            _hoverInfoProvider = hoverInfoProvider;
        }

        // /api/csharp/hover
        [HttpPost("hover")]
        public async Task<IActionResult> Hover([FromBody] HoverInfoRequest request)
        {
            if (request.Code is null)
            {
                return BadRequest(new { message = "Code is null." });
            }

            var hoverInfo = await _hoverInfoProvider.ProvideAsync(request);
            if (hoverInfo == null)
            {
                return Ok(new { information = string.Empty });
            }
            return Ok(hoverInfo);
        }
    }
}
```

## CSharpSignatureHelpController.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using Microsoft.AspNetCore.Mvc;

namespace CodeAnalysisServer.Controllers
{
    [ApiController]
    [Route("api/csharp")]
    public class CSharpSignatureHelpController : ControllerBase
    {
        private readonly ISignatureHelpProvider _signatureHelpProvider;

        public CSharpSignatureHelpController(ISignatureHelpProvider signatureHelpProvider)
        {
            _signatureHelpProvider = signatureHelpProvider;
        }

        // /api/csharp/signatureHelp
        [HttpPost("signatureHelp")]
        public async Task<IActionResult> SignatureHelp([FromBody] SignatureHelpRequest request)
        {
            if (request.Code is null)
            {
                return BadRequest(new { message = "Code is null." });
            }

            var signatureHelp = await _signatureHelpProvider.ProvideAsync(request);
            if (signatureHelp == null)
            {
                return Ok(new { });
            }
            return Ok(signatureHelp);
        }
    }
}
```

## CSharpTabCompletionController.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using Microsoft.AspNetCore.Mvc;

namespace CodeAnalysisServer.Controllers
{
    [ApiController]
    [Route("api/csharp")]
    public class CSharpTabCompletionController : ControllerBase
    {
        private readonly ITabCompletionProvider _tabCompletionProvider;

        public CSharpTabCompletionController(ITabCompletionProvider tabCompletionProvider)
        {
            _tabCompletionProvider = tabCompletionProvider;
        }

        // /api/csharp/tabCompletion
        [HttpPost("tabCompletion")]
        public async Task<IActionResult> TabCompletion([FromBody] TabCompletionRequest request)
        {
            if (request.Code is null)
            {
                return BadRequest(new { message = "Code is null." });
            }

            var tabCompletions = await _tabCompletionProvider.ProvideAsync(request);
            if (tabCompletions == null || tabCompletions.Length == 0)
            {
                return Ok(new { suggestions = Array.Empty<object>() });
            }
            return Ok(new { suggestions = tabCompletions });
        }
    }
}
```

---

# 手順33: `code-analysis-server/CodeAnalysisServer/Properties/launchSettings.json` を編集

既に存在する`Properties/launchSettings.json`を開き、必要に応じて編集します。
基本的には以下のようになっていますが、ポート番号やその他の設定を調整してください。

```jsonc
{
  "$schema": "http://json.schemastore.org/launchsettings.json",
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:13922",
      "sslPort": 44343
    }
  },
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "http://localhost:6000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "launchUrl": "swagger",
      "applicationUrl": "https://localhost:7036;http://localhost:6000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "launchUrl": "swagger",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

**注意点:**
- `applicationUrl`のポート番号が既存のアプリと競合しないように確認してください。
- HTTPSを使用する場合、証明書の設定が必要です。

---

# 手順34: `code-analysis-server/CodeAnalysisServer/Services` フォルダ内のサービスクラスを作成

各サービスファイルを作成し、以下の内容を記述します。

## AssemblyProvider.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using Microsoft.CodeAnalysis;

namespace CodeAnalysisServer.Services
{
    public class AssemblyProvider : IAssemblyProvider
    {
        public List<MetadataReference> GetAssemblies()
        {
            return AppDomain.CurrentDomain.GetAssemblies()
                .Where(a => !a.IsDynamic
                && !string.IsNullOrEmpty(a.Location)
                && (a.GetName().Name?.StartsWith("System", StringComparison.OrdinalIgnoreCase) ?? false))
                .Select(a => (MetadataReference)MetadataReference.CreateFromFile(a.Location))
                .ToList();
        }
    }
}
```

## CodeCheckProvider.cs

```cs
using CodeAnalysisServer.Api.Enums;
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;
using CodeAnalysisServer.Workspaces;
using Microsoft.CodeAnalysis;

namespace CodeAnalysisServer.Services
{
    public class CodeCheckProvider : ICodeCheckProvider
    {
        private readonly IAssemblyProvider _assemblyProvider;

        public CodeCheckProvider(IAssemblyProvider assemblyProvider)
        {
            _assemblyProvider = assemblyProvider;
        }

        public async Task<CodeCheckResult[]> ProvideAsync(CodeCheckRequest request)
        {
            var workspace = new CompletionWorkspace(_assemblyProvider);
            var document = await workspace.CreateDocumentAsync(request.Code);
            if (document == null) return [];

            // Roslyn での Emit（コンパイル）結果を取得
            var emitResult = await workspace.EmitDocumentAsync(document, default);

            // 取得した Diagnostic の中からエラーと警告のみフィルタ
            var diagnostics = emitResult.Diagnostics
                .Where(d => d.Severity == DiagnosticSeverity.Error ||
                            d.Severity == DiagnosticSeverity.Warning)
                .Select(d =>
                {
                    // Roslyn は 0-based 行列のため +1 して返却
                    var lineSpan = d.Location.GetLineSpan();
                    int line = lineSpan.StartLinePosition.Line + 1;
                    int character = lineSpan.StartLinePosition.Character + 1;

                    return new CodeCheckResult
                    {
                        Id = d.Id,
                        Message = d.GetMessage(),
                        Line = line,
                        Character = character,
                        Severity = (d.Severity == DiagnosticSeverity.Error)
                            ? CodeCheckSeverity.Error
                            : CodeCheckSeverity.Warning
                    };
                })
                .ToArray();

            return diagnostics;
        }
    }
}
```

## CodeFixProvider.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;
using CodeAnalysisServer.Workspaces;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace CodeAnalysisServer.Services
{
    public class CodeFixProvider : ICodeFixProvider
    {
        private readonly IAssemblyProvider _assemblyProvider;

        public CodeFixProvider(IAssemblyProvider assemblyProvider)
        {
            _assemblyProvider = assemblyProvider;
        }

        /// <summary>
        /// コードを解析し、診断結果に基づいてコード修正案を生成します。
        /// </summary>
        /// <param name="request">解析対象のコードを含むリクエスト</param>
        /// <returns>生成されたコード修正案のリスト</returns>
        public async Task<CodeFixResult[]> ProvideAsync(CodeFixRequest request)
        {
            var workspace = new CompletionWorkspace(_assemblyProvider);
            var document = await workspace.CreateDocumentAsync(request.Code);
            if (document == null) return [];

            var semanticModel = await document.GetSemanticModelAsync();
            var syntaxRoot = await document.GetSyntaxRootAsync();
            var compilation = await document.Project.GetCompilationAsync();

            if (semanticModel == null || syntaxRoot == null || compilation == null) return [];

            // エラーまたは警告で、リクエストと同じ診断情報を取得
            var diagnostics = semanticModel.GetDiagnostics()
                .Where(d =>
                    (d.Severity == DiagnosticSeverity.Error ||
                    d.Severity == DiagnosticSeverity.Warning) &&
                    d.Location.SourceSpan.Contains(request.Position)
                );

            // 診断ごとにコード修正案を生成
            return diagnostics
                .SelectMany(diagnostic => HandleDiagnostic(diagnostic, compilation, semanticModel, syntaxRoot))
                .Where(result => result != null).OfType<CodeFixResult>()
                .ToArray();
        }

        /// <summary>
        /// 特定の診断情報に基づいて対応する修正案を生成します。
        /// </summary>
        private static IEnumerable<CodeFixResult?> HandleDiagnostic(
            Diagnostic diagnostic, Compilation compilation, SemanticModel semanticModel, SyntaxNode syntaxRoot)
        {
            var diagnosticSpan = diagnostic.Location.SourceSpan;
            if (syntaxRoot.FindNode(diagnosticSpan) is not CSharpSyntaxNode node) yield break;

            switch (diagnostic.Id)
            {
                case "CS0246": // 型または名前空間が見つからない場合
                case "CS0103": // 未定義の識別子の場合
                    foreach (var fix in HandleMissingTypeOrNamespace(diagnostic, compilation, syntaxRoot, node))
                    {
                        yield return fix;
                    }
                    break;

                case "CS1061": // メソッドやプロパティが見つからない場合
                    foreach (var fix in HandleMissingMember(diagnostic, compilation, semanticModel, syntaxRoot, node))
                    {
                        yield return fix;
                    }
                    break;

                default:
                    // その他のエラーコードは未対応
                    yield break;
            }
        }

        /// <summary>
        /// 型や名前空間が不足している診断に対応した修正案を生成します。
        /// </summary>
        private static IEnumerable<CodeFixResult?> HandleMissingTypeOrNamespace(
            Diagnostic diagnostic, Compilation compilation, SyntaxNode syntaxRoot, CSharpSyntaxNode node)
        {
            // 不足している型や名前空間の名前を取得
            var missingName = node switch
            {
                GenericNameSyntax genericNode => genericNode.Identifier.Text,
                IdentifierNameSyntax identifierNode => identifierNode.Identifier.Text,
                _ => null
            };

            if (missingName == null) yield break;

            // 該当する名前空間を探索し、修正案を生成
            foreach (var namespaceToAdd in FindNamespacesForMissingTypeOrSymbol(compilation, missingName))
            {
                yield return CreateUsingDirectiveFix(diagnostic, syntaxRoot, namespaceToAdd);
            }
        }

        /// <summary>
        /// メンバーが不足している診断に対応した修正案を生成します。
        /// </summary>
        private static IEnumerable<CodeFixResult?> HandleMissingMember(
            Diagnostic diagnostic, Compilation compilation, SemanticModel semanticModel, SyntaxNode syntaxRoot, CSharpSyntaxNode node)
        {
            // 親ノードがMemberAccessExpressionSyntaxか確認
            if (node.Parent is not MemberAccessExpressionSyntax parent) yield break;

            // 不足しているメンバー名を取得
            var missingMemberName = parent.Name.Identifier.Text;
            if (parent.Expression is not IdentifierNameSyntax containingType) yield break;

            var typeInfo = semanticModel.GetTypeInfo(containingType);

            // 該当する名前空間を探索し、修正案を生成
            foreach (var namespaceToAdd in FindNamespacesForMissingTypeOrSymbol(compilation, missingMemberName, typeInfo.Type))
            {
                yield return CreateUsingDirectiveFix(diagnostic, syntaxRoot, namespaceToAdd);
            }
        }

        /// <summary>
        /// 不足している型やシンボルに対応する名前空間を検索します。
        /// </summary>
        private static IEnumerable<string> FindNamespacesForMissingTypeOrSymbol(
            Compilation compilation, string name, ITypeSymbol? memberType = null)
        {
            foreach (var reference in compilation.References)
            {
                if (compilation.GetAssemblyOrModuleSymbol(reference) is not IAssemblySymbol assemblySymbol) continue;

                foreach (var namespaceSymbol in GetAllNamespaces(assemblySymbol.GlobalNamespace))
                {
                    foreach (var typeSymbol in namespaceSymbol.GetTypeMembers())
                    {
                        if (typeSymbol.Name == name || (memberType != null && IsSameOrDerived(typeSymbol, memberType)))
                        {
                            yield return typeSymbol.ContainingNamespace.ToDisplayString();
                        }
                    }
                }
            }
        }

        /// <summary>
        /// 指定された型がターゲット型と同一または派生しているかを判定します。
        /// </summary>
        private static bool IsSameOrDerived(ITypeSymbol type, ITypeSymbol target)
        {
            if (SymbolEqualityComparer.Default.Equals(type, target)) return true;

            // 基底クラスをチェック
            var baseType = target.BaseType;
            while (baseType != null)
            {
                if (SymbolEqualityComparer.Default.Equals(baseType, type)) return true;
                baseType = baseType.BaseType;
            }

            // 実装されたインターフェイスをチェック
            return target.AllInterfaces.Any(i =>
                type.GetMembers().OfType<IMethodSymbol>()
                    .Where(m => m.IsExtensionMethod)
                    .Any(m => SymbolEqualityComparer.Default.Equals(m.Parameters.FirstOrDefault()?.Type, i)));
        }

        /// <summary>
        /// 指定された名前空間をすべて再帰的に取得します。
        /// </summary>
        private static IEnumerable<INamespaceSymbol> GetAllNamespaces(INamespaceSymbol root)
        {
            foreach (var ns in root.GetNamespaceMembers())
            {
                yield return ns;
                foreach (var child in GetAllNamespaces(ns))
                {
                    yield return child;
                }
            }
        }

        /// <summary>
        /// usingディレクティブを追加する修正案を生成します。
        /// </summary>
        private static CodeFixResult? CreateUsingDirectiveFix(Diagnostic diagnostic, SyntaxNode syntaxRoot, string namespaceToAdd)
        {
            var compilationUnit = syntaxRoot as CompilationUnitSyntax;
            if (compilationUnit == null || compilationUnit.Usings.Any(u => u.Name?.ToString() == namespaceToAdd)) return null;

            var lastUsing = compilationUnit.Usings.LastOrDefault();
            var insertionLine = lastUsing != null
                ? lastUsing.GetLocation().GetLineSpan().EndLinePosition.Line + 1
                : 0;

            return new CodeFixResult
            {
                Diagnostic = diagnostic.GetMessage(),
                Title = $"using {namespaceToAdd};",
                Text = $"using {namespaceToAdd};\n",
                Range = new Api.Responses.Range
                {
                    StartLineNumber = insertionLine + 1,
                    StartColumn = 1,
                    EndLineNumber = insertionLine + 1,
                    EndColumn = 1
                }
            };
        }
    }
}
```

## CompletionProvider.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;
using CodeAnalysisServer.Workspaces;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Completion;
using Microsoft.Extensions.Caching.Memory;

namespace CodeAnalysisServer.Services
{
    public class CompletionProvider : ICompletionProvider
    {
        private readonly IAssemblyProvider _assemblyProvider;
        private readonly IMemoryCache _cache;

        public CompletionProvider(IAssemblyProvider assemblyProvider, IMemoryCache cache)
        {
            _assemblyProvider = assemblyProvider;
            _cache = cache;
        }

        public async Task<CompletionResult[]> ProvideCompletionAsync(CompletionRequest request)
        {
            var cacheKey = $"{request.UserId}_{request.Code}_{request.CursorPosition}_completion";
            if (_cache.TryGetValue(cacheKey, out CompletionResult[]? cachedCompletions))
            {
                return cachedCompletions ?? [];
            }

            // Workspace & Document 作成
            var workspace = new CompletionWorkspace(_assemblyProvider);
            var document = await workspace.CreateDocumentAsync(request.Code);
            if (document == null) return [];

            var completionService = CompletionService.GetService(document);
            if (completionService == null) return [];
            var completions = await completionService.GetCompletionsAsync(document, request.CursorPosition);
            if (completions == null) return [];

            var semanticModel = await document.GetSemanticModelAsync();
            var syntaxRoot = await document.GetSyntaxRootAsync();
            if (semanticModel == null || syntaxRoot == null) return [];

            var resultList = new List<CompletionResult>();

            foreach (var item in completions.ItemsList)
            {
                // Roslyn が想定する挿入テキストと置換範囲を取得
                var change = await completionService.GetChangeAsync(document, item);
                if (change == null) continue;

                // 補完アイテムの詳細説明を取得
                var desc = await completionService.GetDescriptionAsync(document, item);
                var detail = desc?.Text ?? string.Empty;

                // 補完処理の詳細を取得
                var textChangeDto = new TextChangeDto
                {
                    Start = change.TextChange.Span.Start,
                    End = change.TextChange.Span.End,
                    NewText = change.TextChange.NewText
                };
                var textChangesDto = change.TextChanges.Select(tc => new TextChangeDto
                {
                    Start = tc.Span.Start,
                    End = tc.Span.End,
                    NewText = tc.NewText
                }).ToArray();

                resultList.Add(new CompletionResult
                {
                    Label = item.DisplayText,
                    Kind = item.Tags.FirstOrDefault() ?? "Text",
                    Detail = detail,
                    MainTextChange = textChangeDto,
                    AdditionalTextChanges = textChangesDto
                });
            }

            var results = resultList.ToArray();
            _cache.Set(cacheKey, results, TimeSpan.FromMinutes(5));

            return results;
        }
    }
}
```

## HoverInfoBuilder.cs

```cs
using Microsoft.CodeAnalysis;
using System.Text;

namespace CodeAnalysisServer.Services
{
  internal static class HoverInfoBuilder
  {
    public static string Build(SymbolInfo symbolInfo)
    {
      var symbol = symbolInfo.Symbol;
      if (symbol == null) return string.Empty;

      return symbol switch
      {
        IMethodSymbol method => BuildMethodInfo(method),
        ILocalSymbol local => BuildLocalInfo(local),
        IFieldSymbol field => BuildFieldInfo(field),
        IPropertySymbol prop => BuildPropertyInfo(prop),
        _ => symbol.ToDisplayString() // それ以外は単純表示
      };
    }

    private static string BuildMethodInfo(IMethodSymbol methodSymbol)
    {
      var sb = new StringBuilder()
          .Append("(method) ")
          .Append(methodSymbol.DeclaredAccessibility.ToString().ToLower())
          .Append(' ');

      if (methodSymbol.IsStatic) sb.Append("static ");

      sb.Append(methodSymbol.Name).Append('(');
      for (int i = 0; i < methodSymbol.Parameters.Length; i++)
      {
        var param = methodSymbol.Parameters[i];
        sb.Append(param.Type.ToDisplayString()).Append(' ').Append(param.Name);
        if (i < methodSymbol.Parameters.Length - 1)
          sb.Append(", ");
      }
      sb.Append(") : ")
        .Append(methodSymbol.ReturnType.ToDisplayString());

      return sb.ToString();
    }

    private static string BuildLocalInfo(ILocalSymbol localSymbol)
    {
      var sb = new StringBuilder();
      sb.Append("(local) ")
        .Append(localSymbol.Name)
        .Append(" : ");

      if (localSymbol.IsConst)
      {
        sb.Append("const ");
      }
      sb.Append(localSymbol.Type.ToDisplayString());

      return sb.ToString();
    }

    private static string BuildFieldInfo(IFieldSymbol fieldSymbol)
    {
      var sb = new StringBuilder();
      sb.Append("(field) ")
        .Append(fieldSymbol.DeclaredAccessibility.ToString().ToLower())
        .Append(' ');

      if (fieldSymbol.IsStatic) sb.Append("static ");
      if (fieldSymbol.IsReadOnly) sb.Append("readonly ");
      if (fieldSymbol.IsConst) sb.Append("const ");

      sb.Append(fieldSymbol.Type.ToDisplayString())
        .Append(' ')
        .Append(fieldSymbol.Name);

      return sb.ToString();
    }

    private static string BuildPropertyInfo(IPropertySymbol propSymbol)
    {
      var sb = new StringBuilder();
      sb.Append("(property) ")
        .Append(propSymbol.DeclaredAccessibility.ToString().ToLower())
        .Append(' ');

      if (propSymbol.IsStatic) sb.Append("static ");

      sb.Append(propSymbol.Type.ToDisplayString())
        .Append(' ')
        .Append(propSymbol.Name);

      return sb.ToString();
    }
  }
}
```

## HoverInformationProvider.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;
using CodeAnalysisServer.Workspaces;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

namespace CodeAnalysisServer.Services
{
    public class HoverInformationProvider : IHoverInformationProvider
    {
        private readonly IAssemblyProvider _assemblyProvider;

        public HoverInformationProvider(IAssemblyProvider assemblyProvider)
        {
            _assemblyProvider = assemblyProvider;
        }

        public async Task<HoverInfoResult?> ProvideAsync(HoverInfoRequest request)
        {
            var workspace = new CompletionWorkspace(_assemblyProvider);
            var document = await workspace.CreateDocumentAsync(request.Code);
            if (document == null) return null;

            var semanticModel = await document.GetSemanticModelAsync();
            if (semanticModel == null) return null;

            var syntaxTree = await document.GetSyntaxTreeAsync();
            if (syntaxTree == null) return null;

            var root = await syntaxTree.GetRootAsync();
            var token = root.FindToken(request.Position);

            // トークンの親ノードを取得
            var node = token.Parent;
            if (node == null) return null;

            // シンボル情報の取得
            var symbolInfo = semanticModel.GetSymbolInfo(node);
            var symbol = symbolInfo.Symbol;
            if (symbol == null) return null;

            // まずビルダーで基本情報を組み立てる
            var infoText = HoverInfoBuilder.Build(symbolInfo);

            // ドキュメントコメントXMLも加えたい場合
            var xmlDocs = symbol.GetDocumentationCommentXml();
            if (!string.IsNullOrWhiteSpace(xmlDocs))
            {
                infoText += "\n" + xmlDocs.Trim();
            }

            return new HoverInfoResult
            {
                Information = infoText
            };
        }
    }
}
```

## InvocationContext.cs

```cs
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace CodeAnalysisServer.Services
{
    internal class InvocationContext
    {
        private InvocationContext(
            SemanticModel semModel,
            int position,
            SyntaxNode receiver,
            IEnumerable<TypeInfo> argTypes,
            IEnumerable<SyntaxToken> separators)
        {
            SemanticModel = semModel;
            Position = position;
            Receiver = receiver;
            ArgumentTypes = argTypes;
            Separators = separators;
        }

        public SemanticModel SemanticModel { get; }
        public int Position { get; }
        public SyntaxNode Receiver { get; }
        public IEnumerable<TypeInfo> ArgumentTypes { get; }
        public IEnumerable<SyntaxToken> Separators { get; }

        /// <summary>
        /// エントリポイント
        /// </summary>
        public static async Task<InvocationContext?> GetInvocation(Document document, int position)
        {
            var tree = await document.GetSyntaxTreeAsync();
            if (tree == null) return null;

            var root = await tree.GetRootAsync();
            var node = root.FindToken(position).Parent;
            if (node == null) return null;

            return FindInvocationSyntax(node, document, position);
        }

        /// <summary>
        /// Cognitive Complexity を下げるため、判定をメソッド分割
        /// </summary>
        private static InvocationContext? FindInvocationSyntax(SyntaxNode? node, Document doc, int position)
        {
            while (node != null)
            {
                var result = TryGetInvocationContext(node, doc, position)
                          ?? TryGetObjectCreationContext(node, doc, position)
                          ?? TryGetAttributeContext(node, doc, position);

                if (result != null)
                {
                    return result;
                }

                node = node.Parent;
            }
            return null;
        }

        private static InvocationContext? TryGetInvocationContext(SyntaxNode node, Document doc, int position)
        {
            if (node is InvocationExpressionSyntax invocation && invocation.ArgumentList.Span.Contains(position))
            {
                var sem = doc.GetSemanticModelAsync().Result;
                if (sem == null) return null;
                return CreateInvocationContext(sem, position, invocation.Expression, invocation.ArgumentList);
            }
            return null;
        }

        private static InvocationContext? TryGetObjectCreationContext(SyntaxNode node, Document doc, int position)
        {
            if (node is BaseObjectCreationExpressionSyntax creation && creation.ArgumentList?.Span.Contains(position) == true)
            {
                var sem = doc.GetSemanticModelAsync().Result;
                if (sem == null) return null;
                return CreateInvocationContext(sem, position, creation, creation.ArgumentList);
            }
            return null;
        }

        private static InvocationContext? TryGetAttributeContext(SyntaxNode node, Document doc, int position)
        {
            if (node is AttributeSyntax attr && attr.ArgumentList?.Span.Contains(position) == true)
            {
                var sem = doc.GetSemanticModelAsync().Result;
                if (sem == null) return null;
                return CreateInvocationContext(sem, position, attr, attr.ArgumentList);
            }
            return null;
        }

        private static InvocationContext? CreateInvocationContext(SemanticModel sem, int position, SyntaxNode receiver, ArgumentListSyntax? argList)
        {
            if (argList == null) return null;

            var argTypes = argList.Arguments.Select(a => sem.GetTypeInfo(a.Expression));
            var separators = argList.Arguments.GetSeparators();
            return new InvocationContext(sem, position, receiver, argTypes, separators);
        }

        private static InvocationContext? CreateInvocationContext(SemanticModel sem, int position, SyntaxNode receiver, AttributeArgumentListSyntax? attrList)
        {
            if (attrList == null) return null;

            var argTypes = attrList.Arguments.Select(a => sem.GetTypeInfo(a.Expression));
            var separators = attrList.Arguments.GetSeparators();
            return new InvocationContext(sem, position, receiver, argTypes, separators);
        }
    }
}
```

## SignatureHelpProvider.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;
using CodeAnalysisServer.Workspaces;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace CodeAnalysisServer.Services
{
    public class SignatureHelpProvider : ISignatureHelpProvider
    {
        private readonly IAssemblyProvider _assemblyProvider;

        public SignatureHelpProvider(IAssemblyProvider assemblyProvider)
        {
            _assemblyProvider = assemblyProvider;
        }

        public async Task<SignatureHelpResult?> ProvideAsync(SignatureHelpRequest request)
        {
            var workspace = new CompletionWorkspace(_assemblyProvider);
            var document = await workspace.CreateDocumentAsync(request.Code);
            if (document == null) return null;

            var invocation = await InvocationContext.GetInvocation(document, request.Position);
            if (invocation == null) return null;

            // ActiveParameter の計算 (カンマごとに引数Indexを増加)
            int activeParameter = CalculateActiveParameter(invocation);

            // メソッド群を取得してフィルタリング
            var methodGroup = GetMethodGroup(invocation);
            if (!methodGroup.Any()) return null;

            var signaturesSet = new HashSet<Signature>();
            var bestScore = int.MinValue;
            Signature? bestSignature = null;

            foreach (var methodOverload in methodGroup)
            {
                var sig = BuildSignature(methodOverload);
                signaturesSet.Add(sig);

                var score = InvocationScore(methodOverload, invocation.ArgumentTypes);
                if (score > bestScore)
                {
                    bestScore = score;
                    bestSignature = sig;
                }
            }

            var signaturesArray = signaturesSet.ToArray();
            int activeSignatureIndex = bestSignature == null ? 0 :
                Array.IndexOf(signaturesArray, bestSignature);

            return new SignatureHelpResult
            {
                Signatures = signaturesArray,
                ActiveParameter = activeParameter,
                ActiveSignature = (activeSignatureIndex >= 0) ? activeSignatureIndex : 0
            };
        }

        // 引数Indexを計算 (Comma区切りごとに+1)
        private static int CalculateActiveParameter(InvocationContext invocation)
        {
            int activeParam = 0;
            foreach (var comma in invocation.Separators)
            {
                if (comma.SpanStart > invocation.Position) break;
                activeParam++;
            }
            return activeParam;
        }

        private static IEnumerable<IMethodSymbol> GetMethodGroup(InvocationContext invocation)
        {
            var semanticModel = invocation.SemanticModel;
            var methodGroup = semanticModel.GetMemberGroup(invocation.Receiver).OfType<IMethodSymbol>();

            if (invocation.Receiver is MemberAccessExpressionSyntax memberAccess)
            {
                var throughExpression = memberAccess.Expression;
                var typeInfo = semanticModel.GetTypeInfo(throughExpression);
                var throughSymbol = semanticModel.GetSpeculativeSymbolInfo(invocation.Position, throughExpression, SpeculativeBindingOption.BindAsExpression).Symbol;
                var speculativeType = semanticModel.GetSpeculativeTypeInfo(invocation.Position, throughExpression, SpeculativeBindingOption.BindAsTypeOrNamespace).Type;

                // static or instance 判定
                bool includeInstance = (throughSymbol != null && !(throughSymbol is ITypeSymbol))
                                       || throughExpression is LiteralExpressionSyntax
                                       || throughExpression is TypeOfExpressionSyntax;
                bool includeStatic = (throughSymbol is INamedTypeSymbol) || speculativeType != null;

                if (speculativeType == null)
                {
                    // static でない場合
                    // (typeInfo.Type が null の場合は instance にならないため)
                    includeInstance = typeInfo.Type != null;
                }

                methodGroup = methodGroup.Where(m =>
                    (m.IsStatic && includeStatic) ||
                    (!m.IsStatic && includeInstance)
                );
            }

            return methodGroup;
        }

        // IMethodSymbol からシグネチャ情報を組み立て
        private static Signature BuildSignature(IMethodSymbol symbol)
        {
            var xmlDocs = symbol.GetDocumentationCommentXml() ?? "";
            var parameters = symbol.Parameters.Select(p => new Parameter
            {
                Label = p.ToDisplayString(SymbolDisplayFormat.MinimallyQualifiedFormat),
                Documentation = p.GetDocumentationCommentXml() ?? ""
            }).ToArray();

            return new Signature
            {
                Label = symbol.ToDisplayString(SymbolDisplayFormat.MinimallyQualifiedFormat),
                Documentation = xmlDocs,
                Parameters = parameters
            };
        }

        // 引数の型とパラメータの型を比較してスコアリング
        private static int InvocationScore(IMethodSymbol symbol, IEnumerable<TypeInfo> argumentTypes)
        {
            var parameters = symbol.Parameters;
            var argCount = argumentTypes.Count();
            if (parameters.Length < argCount)
                return int.MinValue; // 引数超過

            int score = 0;
            var paramEnum = parameters.GetEnumerator();
            var argEnum = argumentTypes.GetEnumerator();

            while (argEnum.MoveNext() && paramEnum.MoveNext())
            {
                var argType = argEnum.Current.ConvertedType;
                var paramType = paramEnum.Current.Type;

                if (argType == null)
                {
                    score += 1; // 型解決できなかったら少し加点
                }
                else if (SymbolEqualityComparer.Default.Equals(argType, paramType))
                {
                    score += 2; // 型が完全一致
                }
            }

            return score;
        }
    }
}
```

## TabCompletionProvider.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;
using CodeAnalysisServer.Workspaces;
using Microsoft.CodeAnalysis.Completion;

namespace CodeAnalysisServer.Services
{
    public class TabCompletionProvider : ITabCompletionProvider
    {
        private readonly IAssemblyProvider _assemblyProvider;

        public TabCompletionProvider(IAssemblyProvider assemblyProvider)
        {
            _assemblyProvider = assemblyProvider;
        }

        public async Task<TabCompletionResult[]> ProvideAsync(TabCompletionRequest request)
        {
            var workspace = new CompletionWorkspace(_assemblyProvider);
            var document = await workspace.CreateDocumentAsync(request.Code);
            if (document == null) return [];

            var completionService = CompletionService.GetService(document);
            if (completionService == null) return [];

            var completions = await completionService.GetCompletionsAsync(document, request.Position);
            var items = completions?.ItemsList;
            if (items == null || items.Count == 0) return [];

            // description を含める
            var resultsList = new List<TabCompletionResult>(items.Count);
            foreach (var item in items)
            {
                var desc = await completionService.GetDescriptionAsync(document, item);
                resultsList.Add(new TabCompletionResult
                {
                    Suggestion = item.DisplayText,
                    Description = desc?.Text ?? string.Empty
                });
            }

            return [.. resultsList];
        }
    }
}
```

---

# 手順35: `code-analysis-server/CodeAnalysisServer/Workspaces` フォルダ内のクラスを作成

## CompletionWorkspace.cs

```cs
using CodeAnalysisServer.Api.Interfaces;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Emit;
using Microsoft.CodeAnalysis.Host.Mef;
using Microsoft.CodeAnalysis.Text;

namespace CodeAnalysisServer.Workspaces
{
    public class CompletionWorkspace
    {
        private readonly Project _project;
        private readonly AdhocWorkspace _workspace;

        public CompletionWorkspace(IAssemblyProvider assemblyProvider)
        {
            var host = MefHostServices.DefaultHost;
            _workspace = new AdhocWorkspace(host);

            var metadataReferences = assemblyProvider.GetAssemblies();

            var projectInfo = ProjectInfo.Create(
                ProjectId.CreateNewId(),
                VersionStamp.Create(),
                "TempProject",
                "TempProject",
                LanguageNames.CSharp
            )
            .WithMetadataReferences(metadataReferences)
            .WithCompilationOptions(
                new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary)
            );

            _project = _workspace.AddProject(projectInfo);
        }

        public async Task<Document?> CreateDocumentAsync(string code)
        {
            // 同期的にはやらず、await で待機
            return await Task.Run(() =>
            {
                var document = _workspace.AddDocument(_project.Id, "CSharpDocument.cs", SourceText.From(code));
                return document;
            });
        }

        public async Task<EmitResult> EmitDocumentAsync(Document document, CancellationToken cancellationToken)
        {
            var compilation = await document.Project.GetCompilationAsync(cancellationToken);
            if (compilation == null)
            {
                // Nullを返さないようにするため、例外投げる
                throw new InvalidOperationException("Compilation failed.");
            }

            using var ms = new MemoryStream();
            var emitResult = compilation.Emit(ms, cancellationToken: cancellationToken);
            return emitResult;
        }
    }
}
```

---

# 手順36: `code-analysis-server/CodeAnalysisServer`直下のアプリ設定を設定

`appsettings.json` と `appsettings.Development.json` を以下のように設定します。

## appsettings.json

```jsonc
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

## appsettings.Development.json

```jsonc
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

---

# 手順37: `code-analysis-server/CodeAnalysisServer/CodeAnalysisServer.http` を作成

APIのテスト用にHTTPリクエストを定義する`CodeAnalysisServer.http`ファイルを作成します。

```http
@CodeAnalysisServer_HostAddress = http://localhost:6000

GET {{CodeAnalysisServer_HostAddress}}/weatherforecast/
Accept: application/json

###
```

---

# 手順38: `code-analysis-server/CodeAnalysisServer/Program.cs` を編集

`Program.cs` を開き、必要なサービスを登録します。
以下のように編集します。

```cs
using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Services;

var builder = WebApplication.CreateBuilder(args);

// Kestrel ポート指定
builder.WebHost.ConfigureKestrel(options =>
{
    // 6000番ポートで Listen
    options.ListenAnyIP(6000);
});

// サービスの追加

// サービスの登録
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<ICompletionProvider, CompletionProvider>();
builder.Services.AddSingleton<ICodeCheckProvider, CodeCheckProvider>();
builder.Services.AddSingleton<IHoverInformationProvider, HoverInformationProvider>();
builder.Services.AddSingleton<ISignatureHelpProvider, SignatureHelpProvider>();
builder.Services.AddSingleton<ITabCompletionProvider, TabCompletionProvider>();
builder.Services.AddSingleton<ICodeFixProvider, CodeFixProvider>();
builder.Services.AddSingleton<IAssemblyProvider>(new AssemblyProvider());

// コントローラーの追加
builder.Services.AddControllers();

// Swaggerサービスの追加
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORSポリシーの設定
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// ミドルウェアの設定

// CORSポリシーの適用
app.UseCors("AllowReactApp");

// Swaggerの設定
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 認証・認可ミドルウェア
app.UseAuthorization();

// コントローラーエンドポイントのマッピング
app.MapControllers();

await app.RunAsync();
```
---

# 手順39: `code-analysis-server` の依存関係をインストール

```bash
# CodeAnalysisServer フォルダ内で
dotnet restore
```

---

# 手順40: `code-analysis-server` のビルドと実行

```bash
# CodeAnalysisServer フォルダ内でビルド
dotnet build

# 実行
dotnet run
```

---

# 手順41: サーバ起動

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
これで**解析サーバのdotnet run**と**サーバのTypeScript watch**と**クライアントのReact dev server**を同時に起動します。  

もし個別にやるなら、**別のターミナル**で起動する

```bash
# ターミナル1
npm run analysis:start # 解析サーバーを起動
```

```bash
# ターミナル2
npm run server:dev  # サーバを監視ビルド+起動
```

```bash
# ターミナル3
npm run client:start # clientフォルダのReact dev server
```

---

# 手順42: ブラウザでアクセス

- 解析サーバー: `http://localhost:6000`  
- サーバ: `http://localhost:4000`  
- クライアント: `http://localhost:3000` (CRAのデフォルトポート)

ブラウザで `http://localhost:3000` を開くと、  
ログインページが表示されます
1. **エディタ**でC# または TypeScript のコードを入力  
2. 「提出前動作確認」で選択したテストケースを1回だけ実行  
3. 「コードを提出する」で複数テストケースをまとめて実行  
4. **タブを切り替える**（他のタブを開くなど）と**失格**扱い  
5. **制限時間を超過**しても失格になる
---