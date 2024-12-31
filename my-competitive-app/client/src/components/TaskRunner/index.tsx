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
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 提出前動作確認用の状態
    const [preSubmitStatus, setPreSubmitStatus] = useState<OutputStatus | null>(null);
    const [preSubmitInput, setPreSubmitInput] = useState('');
    const [preSubmitExpectedOutput, setPreSubmitExpectedOutput] = useState('');
    const [preSubmitActualOutput, setPreSubmitActualOutput] = useState('');
    const [preSubmitErrorMessages, setPreSubmitErrorMessages] = useState('');

    useEffect(() => {
        // 言語が変更された際にデフォルトのコードを設定し、プレテスト結果をクリア
        setUserCode(defaultCodes[language]);
        setPreSubmitStatus(null);
    }, [language]);

    // 提出前の単一テストケース実行
    const handlePreSubmit = async () => {
        const selectedTestCase = task.testCases[sampleIndex];
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

    const handleRunCode = async (isSubmit: boolean) => {
        setIsSubmitting(true);

        if (isSubmit) {
            await executeAllTestCases();
            onComplete();
        } else {
            await handlePreSubmit();
        }

        setIsSubmitting(false);
    };

    const toTask = () => {
        setPreSubmitStatus(null);
        switchModeToTask();
    }

    const handleTestRun = () => {
        handleRunCode(false);
    };

    const handleSubmit = () => {
        handleRunCode(true);
    };

    return (
        <div className={styles.container}>
            {mode === 'practice' && (
                <Button onClick={toTask} variant="secondary" className={styles.switchButton}>
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
                        {task.testCases.map((tc, index) => (
                            <option key={`${tc.input}-${index}`} value={index}>
                                入力例{index + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <Button
                    onClick={handleTestRun}
                    disabled={isSubmitting || sampleIndex === null}
                    variant="secondary"
                    className={styles.submitButton}
                >
                    {isSubmitting ? '確認中...' : '提出前動作確認'}
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
                disabled={isSubmitting}
                variant="primary"
                className={styles.submitButton}
            >
                {isSubmitting ? '提出中...' : 'コードを提出する'}
            </Button>
        </div>
    );
};

export default TaskRunner;