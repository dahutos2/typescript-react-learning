import React, { useState, useEffect } from 'react';
import CodeEditor from '../CodeEditor';
import { LangOption, Task, TaskMode } from '../../utils/types';
import defaultCodes from '../../data/defaultCodes.json';
import styles from './TaskRunner.module.css';
import Button from '../shared/Button';

interface TaskRunnerProps {
    task: Task;
    userId: string;
    mode: TaskMode;
    switchModeToTask: () => void;
}

const TaskRunner: React.FC<TaskRunnerProps> = ({ task, userId, mode, switchModeToTask }) => {
    const [language, setLanguage] = useState<LangOption>('csharp');
    const [userCode, setUserCode] = useState('');
    const [sampleIndex, setSampleIndex] = useState(0);
    const [output, setOutput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // 言語が変更された際にデフォルトのコードを設定し、Outputをクリア
        setUserCode(defaultCodes[language]);
        setOutput('');
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
                body: JSON.stringify({ code: userCode, input: testCase.input, userId: userId })
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
                    body: JSON.stringify({ code: userCode, input: tc.input, userId: userId })
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
        <div className={styles.container}>
            {mode === 'practice' && (
                <Button onClick={switchModeToTask} variant="secondary" className={styles.switchButton}>
                    本番モードに切り替える
                </Button>
            )}

            <h3 className={styles.taskTitle}>{task.title}</h3>
            <div className={styles.taskDescription}>
                <p>{task.description}</p>
            </div>

            {/* テストケースの詳細表示 */}
            <div className={styles.testCaseDetails}>
                {task.testCases.map((tc, index) => (
                    <div key={tc.input} className={styles.individualTestCase}>
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

            {/* テストケース選択 */}
            <div className={styles.formGroup}>
                <label htmlFor="testcase-select">テストケース: </label>
                <select
                    id="testcase-select"
                    value={sampleIndex}
                    onChange={(e) => {
                        setSampleIndex(Number(e.target.value));
                        setOutput('');
                    }}
                    className={styles.select}
                >
                    {task.testCases.map((tc, index) => (
                        <option key={tc.input} value={index}>
                            入力例{index + 1}
                        </option>
                    ))}
                </select>
            </div>

            {/* ボタン群 */}
            <div className={styles.buttonGroup}>
                <Button onClick={handleCompileAndTest} disabled={isSubmitting} variant="secondary" className={styles.button}>
                    {isSubmitting ? '実行中...' : '提出前動作確認'}
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} variant="primary" className={styles.button}>
                    {isSubmitting ? '提出中...' : 'コードを提出する'}
                </Button>
            </div>

            {/* 出力エリア */}
            <div className={styles.outputContainer}>
                <h4 className={styles.outputTitle}>Output:</h4>
                <div className={styles.output}>
                    <pre>{output}</pre>
                </div>
            </div>
        </div>
    );
};

export default TaskRunner;
