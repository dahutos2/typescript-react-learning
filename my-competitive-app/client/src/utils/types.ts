export type TaskMode = 'task' | 'practice';
export type LangOption = 'csharp' | 'typescript';
export interface TestCase {
    input: string;
    output: string;
}
export interface Task {
    id: number;
    title: string;
    description: string;
    timeLimitSec: number;
    testCases: TestCase[];
}