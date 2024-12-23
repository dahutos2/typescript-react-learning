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