export type TaskMode = 'task' | 'practice';

// ユーザーごとのタスク管理
export interface UserState {
    disqualified: boolean;
    mode: TaskMode;
    taskStartTime?: number; // タスク開始時刻（ミリ秒）
    timeLimitSec?: number;  // タスクの制限時間（秒）
}

export class CommandError extends Error {
    public stdout: string;
    public stderr: string;

    constructor(message: string, stdout: string, stderr: string) {
        super(message);
        this.stdout = stdout;
        this.stderr = stderr;
        Object.setPrototypeOf(this, CommandError.prototype);
    }
}