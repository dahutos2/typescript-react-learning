export type TaskMode = 'task' | 'practice';

// ユーザーごとのタスク管理
export interface UserState {
    disqualified: boolean;
    mode: TaskMode;
    taskStartTime?: number; // タスク開始時刻（ミリ秒）
    timeLimitSec?: number;  // タスクの制限時間（秒）
}