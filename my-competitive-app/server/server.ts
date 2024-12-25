// server/server.ts
import express from 'express';
import { runCsCode, runTsCode } from './runCode';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 4000;

// CORS設定
app.use(cors());

// JSONパースミドルウェア
app.use(express.json());

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../../client/build')));

// C#コード実行エンドポイント
app.post('/api/run-cs', async (req, res) => {
  const { code, input } = req.body;
  try {
    const output = await runCsCode(code, input);
    res.json({ success: true, output });
  } catch (error: any) {
    res.json({ success: false, output: error.message });
  }
});

// TypeScriptコード実行エンドポイント
app.post('/api/run-ts', async (req, res) => {
  const { code, input } = req.body;
  try {
    const output = await runTsCode(code, input);
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
