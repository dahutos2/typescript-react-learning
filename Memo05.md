申し訳ありません。文字化けの問題が解消されないとのことですね。以下に、文字化けの原因とその対策を詳しく説明します。修正が必要な箇所のみを端的に示します。

1. 文字化けの原因

a. 文字エンコーディングの不一致
	•	原因: クライアントとサーバー間で文字エンコーディング（通常はUTF-8）が一致していないため、データが正しく解釈されず文字化けが発生します。

b. Content-Typeヘッダーの設定不備
	•	原因: クライアントから送信されるリクエストのContent-Typeヘッダーが正しく設定されていないため、サーバーがデータを正しく解析できていない可能性があります。

c. サーバー側のデータパース設定不備
	•	原因: Expressサーバーが受信データを正しくパースできていないため、データが文字化けしている可能性があります。

d. データのシリアライズ・デシリアライズの問題
	•	原因: データが送信前に正しくシリアライズされていない、またはサーバー側で正しくデシリアライズされていないため、文字化けが発生します。

2. 対策

a. クライアント側の修正

i. fetch リクエストのヘッダー設定

クライアント側でデータを送信する際に、Content-Typeヘッダーを正しく設定し、UTF-8エンコーディングを明示します。

修正箇所: client/src/components/TaskRunner.tsx

// client/src/components/TaskRunner.tsx 内の fetch 呼び出し部分

// 修正前:
body: JSON.stringify({ code: userCode, input: testCase.input, userId })

// 修正後:
body: JSON.stringify({ code: userCode, input: testCase.input, userId }),
headers: {
  'Content-Type': 'application/json; charset=utf-8',
},

具体的には、fetchメソッドのheadersオプションに'Content-Type': 'application/json; charset=utf-8'を追加します。

const res = await fetch(url, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json; charset=utf-8' 
  },
  body: JSON.stringify({ code: userCode, input: testCase.input, userId })
});

b. サーバー側の修正

i. ExpressのJSONパースミドルウェア設定

Expressサーバーが受信するJSONデータを正しくパースするために、express.json()ミドルウェアを正しく設定します。

修正箇所: server/server.ts

// server/server.ts

// 修正前:
app.use(express.json());

// 修正後:
app.use(express.json({
  type: 'application/json; charset=utf-8',
  limit: '10mb', // 必要に応じてサイズ制限を設定
}));

ただし、express.json()はデフォルトでContent-Typeがapplication/jsonのリクエストをパースします。上記の修正は明示的にエンコーディングを指定する例です。通常、express.json()のデフォルト設定で問題ないはずですが、明示的に設定することで問題が解消される場合があります。

ii. データパース時のエンコーディング確認

サーバー側で受信したデータをログに出力し、正しく受信できているか確認します。

修正箇所: server/server.ts

// server/server.ts

app.post('/api/run-cs', async (req, res) => {
  console.log('Received data:', req.body); // 追加
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

app.post('/api/run-ts', async (req, res) => {
  console.log('Received data:', req.body); // 追加
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

これにより、受信したデータが正しくパースされているか確認できます。ログ出力で文字化けが発生している場合、エンコーディングの問題が明確になります。

c. データのシリアライズ確認

i. クライアント側でのデータシリアライズ

データが正しくシリアライズされているか確認します。特に、非ASCII文字（日本語など）が含まれている場合、JSON.stringifyが正しく動作しているか確認します。

修正箇所: 特になし（JSON.stringifyを使用している場合は基本的に問題ないはず）

body: JSON.stringify({ code: userCode, input: testCase.input, userId }),

d. ファイルシステムのエンコーディング確認

サーバーがファイルを読み書きする際に、正しいエンコーディング（UTF-8）で操作しているか確認します。

修正箇所: server/runCode.ts

// server/runCode.ts

// 修正前:
fs.writeFileSync(csFilePath, code);

// 修正後:
fs.writeFileSync(csFilePath, code, 'utf8');

同様に、TypeScriptファイルを書き込む際もエンコーディングを指定します。

fs.writeFileSync(tsFilePath, code, 'utf8');

e. サーバー側のレスポンス設定確認

サーバーが送信するレスポンスも正しいエンコーディングであることを確認します。通常、ExpressはデフォルトでUTF-8を使用しますが、念のため確認します。

修正箇所: server/server.ts

// server/server.ts

// JSONレスポンスの場合は特に問題ないはずですが、明示的に設定することも可能
app.post('/api/run-cs', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // ... 既存のコード
});

app.post('/api/run-ts', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // ... 既存のコード
});

f. クライアントとサーバーのエンコーディング確認

i. ファイルエンコーディングの確認

クライアントとサーバーのコードファイル自体がUTF-8で保存されていることを確認します。エディタの設定や保存時のエンコーディングを確認してください。

g. 環境設定の確認

i. Node.jsのデフォルトエンコーディング確認

Node.jsがUTF-8をデフォルトエンコーディングとして使用していることを確認します。通常、Node.jsはUTF-8を使用しますが、環境変数やシステム設定で変更されていないか確認します。

3. 具体的な修正箇所のまとめ

a. クライアント側

TaskRunner.tsx の修正

// client/src/components/TaskRunner.tsx 内の fetch 呼び出し部分

const res = await fetch(url, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json; charset=utf-8' 
  },
  body: JSON.stringify({ code: userCode, input: testCase.input, userId })
});

b. サーバー側

server.ts の修正

// server/server.ts

app.use(express.json({
  type: 'application/json; charset=utf-8',
  limit: '10mb', // 必要に応じてサイズ制限を設定
}));

app.post('/api/run-cs', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  console.log('Received data:', req.body);
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

app.post('/api/run-ts', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  console.log('Received data:', req.body);
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

runCode.ts の修正

// server/runCode.ts

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
    fs.writeFileSync(csFilePath, code, 'utf8'); // 修正

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
    fs.writeFileSync(tsFilePath, code, 'utf8'); // 修正

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

c. その他の確認事項

i. ファイルのエンコーディング確認
	•	原因: クライアントとサーバーのコードファイル自体がUTF-8で保存されていない場合、データの送受信時に文字化けが発生する可能性があります。
	•	対策: 使用しているエディタの設定を確認し、全てのソースファイルがUTF-8で保存されていることを確認してください。

ii. ログの確認
	•	原因: データの送信前後で文字化けが発生している箇所を特定できていない場合。
	•	対策: クライアントとサーバーの両方で送信前後のデータをログに出力し、どの時点で文字化けが発生しているかを確認します。

クライアント側:

// TaskRunner.tsx 内の fetch 呼び出し前にログ出力
console.log('Sending data:', { code: userCode, input: testCase.input, userId });

サーバー側:

// server/server.ts 内のエンドポイントでデータ受信時にログ出力
app.post('/api/run-cs', async (req, res) => {
  console.log('Received data:', req.body);
  // ... 既存のコード
});

app.post('/api/run-ts', async (req, res) => {
  console.log('Received data:', req.body);
  // ... 既存のコード
});

これにより、送信前と受信後のデータが正しくログに出力され、文字化けが発生している箇所を特定できます。

3. 追加の考慮事項

a. エスケープシーケンスの確認
	•	原因: 送信するデータにエスケープが必要な文字（例: ダブルクォート、バックスラッシュなど）が含まれている場合、正しくエスケープされていないと文字化けが発生する可能性があります。
	•	対策: JSON.stringifyを使用してデータをシリアライズする際に、これらの文字が正しくエスケープされることを確認します。

b. ネットワークの問題
	•	原因: データが途中で壊れるなど、ネットワーク経由でデータが正しく送信されていない場合。
	•	対策: ローカル環境で問題が発生している場合は少ないですが、他のネットワーク設定やプロキシが影響している可能性を確認します。

c. サーバーのログインロジックの確認
	•	原因: サーバー側でユーザーIDの処理に問題がある場合。
	•	対策: ユーザーIDがサーバー側で正しく受信・処理されているか確認します。特に、ユーザーIDに日本語や特殊文字が含まれている場合、エンコーディングの問題が発生しやすくなります。

4. まとめ

以下の修正箇所を適用することで、クライアントとサーバー間の文字エンコーディング問題を解消し、文字化けを防ぐことができます。

a. クライアント側 (TaskRunner.tsx) の修正

// client/src/components/TaskRunner.tsx 内の fetch 呼び出し部分

const res = await fetch(url, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json; charset=utf-8' 
  },
  body: JSON.stringify({ code: userCode, input: testCase.input, userId })
});

b. サーバー側 (server.ts) の修正

// server/server.ts

app.use(express.json({
  type: 'application/json; charset=utf-8',
  limit: '10mb', // 必要に応じてサイズ制限を設定
}));

app.post('/api/run-cs', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  console.log('Received data:', req.body);
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

app.post('/api/run-ts', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  console.log('Received data:', req.body);
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

c. サーバー側のファイル操作の修正 (runCode.ts)

// server/runCode.ts

fs.writeFileSync(csFilePath, code, 'utf8'); // C#コードの書き込み
fs.writeFileSync(tsFilePath, code, 'utf8'); // TypeScriptコードの書き込み

d. ログの追加

クライアント側 (TaskRunner.tsx):

// client/src/components/TaskRunner.tsx 内の fetch 呼び出し前にログ出力
console.log('Sending data:', { code: userCode, input: testCase.input, userId });

サーバー側 (server.ts):

// server/server.ts 内のエンドポイントでデータ受信時にログ出力
app.post('/api/run-cs', async (req, res) => {
  console.log('Received data:', req.body);
  // ... 既存のコード
});

app.post('/api/run-ts', async (req, res) => {
  console.log('Received data:', req.body);
  // ... 既存のコード
});

5. 最後に

上記の修正を行った後、以下の手順で問題が解消されているか確認してください。
	1.	クライアントとサーバーの両方を再起動する:
	•	クライアントとサーバーを再起動して、設定変更が反映されていることを確認します。
	2.	データ送信と受信のログを確認する:
	•	クライアント側のコンソールとサーバー側のターミナルでログを確認し、送信データと受信データが正しくエンコードされていることを確認します。
	3.	簡単なテストケースを試す:
	•	文字化けが発生しないように、ASCII文字のみを含む簡単なテストケースをまず試し、次に日本語や特殊文字を含むテストケースを試してみてください。
	4.	エディタのエンコーディング設定を確認する:
	•	使用しているエディタやIDEがUTF-8エンコーディングを使用してファイルを保存していることを確認します。

これでも問題が解決しない場合、具体的な文字化けの例（送信するデータの内容とサーバーで受信した内容）やエラーメッセージを提供していただければ、さらに詳細なサポートが可能です。

何か他に質問や問題がありましたら、お知らせください。
