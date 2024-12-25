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
}

type LangOption = 'csharp' | 'typescript';

const TaskRunner: React.FC<TaskRunnerProps> = ({ task }) => {
  const [language, setLanguage] = useState<LangOption>('csharp');
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
          body: JSON.stringify({ code: userCode, input: tc.input })
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
        {task.testCases.map((tc) => (
          <div key={tc.input} className='individual-test-case'>
            <div>
              <strong>入力例{task.testCases.indexOf(tc) + 1}:</strong>
              <pre>{tc.input}</pre>
            </div>
            <div>
              <strong>期待される出力:</strong>
              <pre>{tc.output}</pre>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="language-select">使用言語: </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as LangOption)}
        >
          <option value='csharp'>C#</option>
          <option value='typescript'>TypeScript</option>
        </select>
      </div>

      <CodeEditor code={userCode} onChange={setUserCode} language={language} />

      {/* テストケース選択と動作確認 */}
      <div style={{ margin: '10px 0' }}>
        <label htmlFor="testcase-select">テストケース: </label>
        <select
          id="testcase-select"
          value={sampleIndex}
          onChange={(e) => setSampleIndex(Number(e.target.value))}
        >
          {task.testCases.map((tc) => (
            <option key={tc.input} value={task.testCases.indexOf(tc)}>
              入力例{task.testCases.indexOf(tc) + 1}
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