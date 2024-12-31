export type TaskMode = 'task' | 'practice';
export type LangOption = 'csharp' | 'typescript';
export type OutputStatus = 'error' | 'failure' | 'success';

export interface TestCase {
    input: string;
    output: string;
    isPublic: boolean;
}

export interface Task {
    id: number;
    title: string;
    description: string;
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
