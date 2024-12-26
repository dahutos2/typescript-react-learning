了解しました。以下に、指定された要件を満たすための修正箇所のみを端的に示します。

1. クライアント側の修正

a. Login.tsx の修正

ファイル: client/src/components/Login.tsx

修正内容:
	•	ユーザーがログイン後に「本番を開始する」か「練習問題を解く」かを選択できるようにボタンを追加します。

// client/src/components/Login.tsx
import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: (userId: string, mode: 'task' | 'practice') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userIdInput, setUserIdInput] = useState('');

  const handleLogin = (selectedMode: 'task' | 'practice') => {
    if (userIdInput.trim() !== '') {
      onLogin(userIdInput.trim(), selectedMode);
    }
  };

  return (
    <div className='login-container'>
      <h2>ようこそ！</h2>
      <input
        type="text"
        placeholder="ユーザーIDを入力してください"
        value={userIdInput}
        onChange={(e) => setUserIdInput(e.target.value)}
        className='user-id-input'
      />
      <button
        className='btn'
        onClick={() => handleLogin('task')}
        disabled={userIdInput.trim() === ''}
      >
        本番を開始する
      </button>
      <button
        className='btn'
        onClick={() => handleLogin('practice')}
        disabled={userIdInput.trim() === ''}
      >
        練習問題を解く
      </button>
    </div>
  );
};

export default Login;

b. App.tsx の修正

ファイル: client/src/App.tsx

修正内容:
	•	ユーザーのモード（本番または練習）を管理し、適切なタスクを表示します。
	•	ログイン後にサーバーからユーザー状態を取得し、失格状態や残り時間を維持します。

// client/src/App.tsx
import React, { useEffect, useState } from 'react';
import tasksData from './data/tasks.json';
import practiceTasksData from './data/practiceTasks.json'; // 練習問題データを追加
import Timer from './components/Timer';
import TaskRunner from './components/TaskRunner';
import Login from './components/Login';
import './styles/style.css';

function App() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [disqualified, setDisqualified] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // タイマーリセット用のキー
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<'task' | 'practice' | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const currentTask = mode === 'task' ? tasksData[currentTaskIndex] : practiceTasksData[0]; // 練習は一つのみと仮定

  // タブがhiddenになったら失格
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setDisqualified(true);
        if (userId && mode === 'task') {
          fetch('/api/disqualify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [userId, mode]);

  const handleTimeUp = () => {
    setDisqualified(true);
    if (userId && mode === 'task') {
      fetch('/api/disqualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    }
  };

  const handleLogin = (newUserId: string, selectedMode: 'task' | 'practice') => {
    setUserId(newUserId);
    setMode(selectedMode);
    // サーバー側でユーザー状態を初期化
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: newUserId, mode: selectedMode }),
    }).then(() => {
      if (selectedMode === 'task') {
        // 初期残り時間を設定（例: 300秒）
        setRemainingTime(300);
      }
    });
  };

  // ログイン後にユーザー状態を取得
  useEffect(() => {
    if (userId && mode === 'task') {
      fetch(`/api/user-state?userId=${encodeURIComponent(userId)}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const { userState } = data;
            if (userState.disqualified) {
              setDisqualified(true);
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
      <div className='container'>
        <div className='disqualified'>失格になりました...(タブが非アクティブ)</div>
        {/* 「次の課題へ」ボタンを削除 */}
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='title'>ローカル競プロ学習アプリ</div>

      <div className='timer'>
        <Timer key={timerKey} totalSec={remainingTime || currentTask.timeLimitSec} onTimeUp={handleTimeUp} />
      </div>

      {/* 「次の課題へ」ボタンを削除 */}

      <TaskRunner task={currentTask} userId={userId} />
    </div>
  );
}

export default App;

c. TaskRunner.tsx の修正

ファイル: client/src/components/TaskRunner.tsx

修正内容:
	•	モードの概念を削除し、ユーザーIDに基づいてタスクを実行します。

// client/src/components/TaskRunner.tsx
import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import './TaskRunner.css';
import defaultCodes from '../data/defaultCodes.json';

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
  userId: string;
}

const TaskRunner: React.FC<TaskRunnerProps> = ({ task, userId }) => {
  const [language, setLanguage] = useState<'csharp' | 'typescript'>('csharp');
  const [userCode, setUserCode] = useState('');
  const [sampleIndex, setSampleIndex] = useState(0);
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 言語が変更された際にデフォルトのコードを設定
    setUserCode(defaultCodes[language]);
  }, [language]);

  const handleCompileAndTest = async () => {
    setIsSubmitting(true);
    setOutput('実行中...');
    const testCase = task.testCases[sampleIndex];
    if (!testCase) {
      setOutput('テストケースが選択されていません');
      setIsSubmitting(false);
      return;
    }
    try {
      const url = language === 'csharp' ? '/api/run-cs' : '/api/run-ts';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: userCode, input: testCase.input, userId })
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
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput('提出中...');
    let resultMessage = '';
    let allPassed = true;

    for (const tc of task.testCases) {
      try {
        const url = language === 'csharp' ? '/api/run-cs' : '/api/run-ts';
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: userCode, input: tc.input, userId })
        });
        const data = await res.json();
        if (!data.success) {
          allPassed = false;
          resultMessage += `【NG】入力: ${tc.input}\nエラー:\n${data.output}\n\n`;
        } else {
          const actual = data.output.trim();
          const expected = tc.output.trim();
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
    setIsSubmitting(false);
  };

  return (
    <div>
      <h3>{task.title}</h3>
      <div className='task-description'>
        <pre>{task.description}</pre>
      </div>

      {/* テストケースの詳細表示 */}
      <div className='test-case-details'>
        <h4>テストケースの詳細表示</h4>
        {task.testCases.map((tc, idx) => (
          <div key={tc.input} className='individual-test-case'>
            <h5>テストケース {idx + 1}</h5>
            <div>
              <strong>入力:</strong>
              <pre>{tc.input}</pre>
            </div>
            <div>
              <strong>期待される出力:</strong>
              <pre>{tc.output}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* テストケース選択と動作確認 */}
      <div style={{ margin: '10px 0' }}>
        <label htmlFor="testcase-select">テストケース: </label>
        <select
          id="testcase-select"
          value={sampleIndex}
          onChange={(e) => setSampleIndex(Number(e.target.value))}
        >
          {task.testCases.map((tc, idx) => (
            <option key={tc.input} value={idx}>
              入力例{idx + 1}
            </option>
          ))}
        </select>

        <button className='btn' onClick={handleCompileAndTest} disabled={isSubmitting}>
          {isSubmitting ? '実行中...' : '提出前動作確認'}
        </button>
      </div>

      <button className='btn' onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? '提出中...' : 'コードを提出する'}
      </button>

      <div className='output'>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default TaskRunner;

2. サーバー側の修正

a. runCode.ts の修正

ファイル: server/runCode.ts

修正内容:
	•	ユーザーごとの状態（失格状態、残り時間）を管理するためのインターフェースとストアを追加。
	•	runCsCode と runTsCode 関数を修正して、ユーザーの状態をチェック・更新します。
	•	ユーザーの初期化と失格を管理する関数を追加します。

// server/runCode.ts
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, '../../temp');

// ユーザーごとのタスク管理
interface UserState {
  disqualified: boolean;
  taskStartTime?: number; // タイムスタンプ（ミリ秒）
  remainingTime?: number; // 秒単位
}

const userStates: { [userId: string]: UserState } = {};

// ユーザーの初期化
export function initializeUser(userId: string, mode: 'task' | 'practice'): void {
  if (!userStates[userId]) {
    userStates[userId] = {
      disqualified: false,
      taskStartTime: mode === 'task' ? Date.now() : undefined,
      remainingTime: mode === 'task' ? 300 : undefined, // 例: 本番は300秒
    };
  }
}

// ユーザーの失格状態を更新
export function disqualifyUser(userId: string): void {
  if (userStates[userId]) {
    userStates[userId].disqualified = true;
  }
}

// ユーザー状態の取得
export function getUserState(userId: string): UserState | null {
  return userStates[userId] || null;
}

// C#コードのコンパイルと実行
export function runCsCode(code: string, input: string, userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const userState = userStates[userId];
    if (!userState || userState.disqualified) {
      return reject(new Error('ユーザーは失格状態です。'));
    }

    // 残り時間のチェック
    if (userState.taskStartTime && userState.remainingTime !== undefined) {
      const elapsed = Math.floor((Date.now() - userState.taskStartTime) / 1000);
      const timeLeft = userState.remainingTime - elapsed;
      if (timeLeft <= 0) {
        userState.disqualified = true;
        return reject(new Error('時間切れで失格しました。'));
      }
      userState.remainingTime = timeLeft;
      userState.taskStartTime = Date.now();
    }

    const csFilePath = path.join(tempDir, `Program_${userId}.cs`);
    fs.writeFileSync(csFilePath, code, 'utf8');

    const compileCmd = `csc "${csFilePath}"`;
    const exePath = path.join(tempDir, `Program_${userId}.exe`);
    const runCmd = `"${exePath}"`;

    exec(compileCmd, { cwd: tempDir }, (compileErr, _stdout, compileStderr) => {
      if (compileErr) {
        return reject(new Error('C#コンパイルエラー:\n' + compileStderr));
      }
      // 実行時に入力を渡す
      const child = exec(runCmd, { cwd: tempDir }, (runErr, runStdout, runStderr) => {
        if (runErr) {
          return reject(new Error('C#実行エラー:\n' + runStderr));
        }
        resolve(runStdout.trim());
      });

      // 標準入力にデータを書き込む
      child.stdin?.write(input);
      child.stdin?.end();
    });
  });
}

// TypeScriptコードのコンパイルと実行
export function runTsCode(code: string, input: string, userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const userState = userStates[userId];
    if (!userState || userState.disqualified) {
      return reject(new Error('ユーザーは失格状態です。'));
    }

    // 残り時間のチェック
    if (userState.taskStartTime && userState.remainingTime !== undefined) {
      const elapsed = Math.floor((Date.now() - userState.taskStartTime) / 1000);
      const timeLeft = userState.remainingTime - elapsed;
      if (timeLeft <= 0) {
        userState.disqualified = true;
        return reject(new Error('時間切れで失格しました。'));
      }
      userState.remainingTime = timeLeft;
      userState.taskStartTime = Date.now();
    }

    const tsFilePath = path.join(tempDir, `temp_${userId}.ts`);
    fs.writeFileSync(tsFilePath, code, 'utf8');

    const compileCmd = `tsc "${tsFilePath}" --outDir "${tempDir}"`;
    const jsFilePath = path.join(tempDir, `temp_${userId}.js`);
    const runCmd = `node "${jsFilePath}"`;

    exec(compileCmd, { cwd: tempDir }, (compileErr, _stdout, compileStderr) => {
      if (compileErr) {
        return reject(new Error('TypeScriptコンパイルエラー:\n' + compileStderr));
      }
      // 実行時に入力を渡す
      const child = exec(runCmd, { cwd: tempDir }, (runErr, runStdout, runStderr) => {
        if (runErr) {
          return reject(new Error('TypeScript実行エラー:\n' + runStderr));
        }
        resolve(runStdout.trim());
      });

      // 標準入力にデータを書き込む
      child.stdin?.write(input);
      child.stdin?.end();
    });
  });
}

b. server.ts の修正

ファイル: server/server.ts

修正内容:
	•	ログイン後にユーザー状態を初期化するエンドポイントを追加。
	•	ユーザーの状態を取得するエンドポイントを追加。
	•	ユーザーの失格状態を更新するエンドポイントを追加。

// server/server.ts
import express from 'express';
import { runCsCode, runTsCode, initializeUser, disqualifyUser, getUserState } from './runCode';
import cors from 'cors';
import path from 'path';

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
  const { userId, mode } = req.body;
  if (!userId || !mode) {
    return res.status(400).json({ success: false, output: 'userIdとmodeが必要です。' });
  }
  initializeUser(userId, mode);
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
  res.json({ success: true, userState });
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

// C#コード実行エンドポイント
app.post('/api/run-cs', async (req, res) => {
  const { code, input, userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, output: 'userIdが必要です。' });
  }
  try {
    const output = await runCsCode(code, input, userId);
    res.json({ success: true, output });
  } catch (error: any) {
    res.json({ success: false, output: error.message });
  }
});

// TypeScriptコード実行エンドポイント
app.post('/api/run-ts', async (req, res) => {
  const { code, input, userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, output: 'userIdが必要です。' });
  }
  try {
    const output = await runTsCode(code, input, userId);
    res.json({ success: true, output });
  } catch (error: any) {
    res.json({ success: false, output: error.message });
  }
});

// 全てのルートをReactアプリにフォワード
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

3. 新規ファイルの追加

a. 練習問題データの追加

ファイル: client/src/data/practiceTasks.json

内容:
	•	練習問題として簡単な問題を定義します。

// client/src/data/practiceTasks.json
[
  {
    "id": 1,
    "title": "練習問題: 文字列の反転",
    "description": "入力された文字列を反転して出力してください。",
    "timeLimitSec": 60, // 練習は60秒の制限時間
    "testCases": [
      {
        "input": "hello",
        "output": "olleh"
      },
      {
        "input": "競プロ",
        "output": "ロプ競"
      }
    ]
  }
]

4. サーバー側のディレクトリ構造確認

注意事項:
	•	サーバー側で temp ディレクトリが存在し、適切な権限が設定されていることを確認してください。

mkdir temp
chmod 700 temp

5. 依存関係の確認と追加

a. クライアント側

必要なパッケージのインストール:
	•	ユーザーIDの入力を管理するために追加のパッケージは不要です（uuid を削除済み）。

b. サーバー側

TypeScript と依存パッケージの確認:
	•	既に TypeScript と関連パッケージがインストールされていることを確認してください。

6. その他の考慮事項

a. セキュリティの強化
	•	現在、ユーザーIDの検証は行われていません。セキュリティを向上させるために、ユーザーIDの形式を制限したり、認証を導入することを検討してください。

b. データの永続化
	•	現在、ユーザーの状態はサーバーのメモリ上に保持されています。アプリケーションを再起動すると状態が失われます。データベース（例: MongoDB、Redis）を使用してユーザー状態を永続化することを検討してください。

まとめ

以上の修正を行うことで、以下の要件を満たすことができます：
	•	ユーザーの識別:
	•	ログイン画面でユーザーが自身のIDを入力し、本番を開始するか練習するかを選択します。
	•	モード選択後のタスク表示:
	•	本番と練習で異なるタスクデータを表示し、見た目を統一します。
	•	失格状態の維持:
	•	サーバー側でユーザーごとに失格状態を管理し、リロード後も状態を維持します。
	•	本番の制限時間の管理:
	•	サーバー側でユーザーごとの残り時間を管理し、リロード後も制限時間を維持します。

これにより、複数ユーザーが同時にアプリを利用でき、ユーザーの状態がサーバー側で適切に管理されるようになります。

何か他に質問や問題がありましたら、お知らせください。
