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