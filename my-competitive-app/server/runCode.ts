import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { UserState, TaskMode } from './types';

const tempDir = path.join(__dirname, '../../temp');

// tempDirが存在しない場合は作成
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const userStates: { [userId: string]: UserState } = {};

// ユーザーの初期化
export function initializeUser(userId: string, mode: TaskMode, timeLimitSec?: number): void {
  if (!userStates[userId]) {
    userStates[userId] = {
      disqualified: false,
      mode,
      taskStartTime: mode === 'task' ? Date.now() : undefined,
      timeLimitSec: mode === 'task' && timeLimitSec ? timeLimitSec : undefined,
    };
  }
}

// ユーザーの失格状態を更新
export function disqualifyUser(userId: string): void {
  if (userStates[userId]) {
    userStates[userId].disqualified = true;
    if (userStates[userId].mode === 'task') {
      writeResultToFile(userId, '失格');
    }
  }
}

// ユーザー状態の取得
export function getUserState(userId: string): UserState | null {
  return userStates[userId] || null;
}

// ユーザー結果をファイルに書き込む関数
function writeResultToFile(userId: string, result: string): void {
  const resultDir = path.join(__dirname, '../../results');
  if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir, { recursive: true });
  }
  const filePath = path.join(resultDir, `${userId}.txt`);
  const content = `結果: ${result}\n日時: ${new Date().toISOString()}\n`;
  fs.appendFileSync(filePath, content, 'utf8');
}

// ユーザーの検証と残り時間の更新
function validateUser(userId: string): void {
  const userState = userStates[userId];
  if (!userState) {
    throw new Error('ユーザーが初期化されていません。');
  }

  if (userState.mode === 'task') {
    if (userState.disqualified) {
      throw new Error('ユーザーは失格状態です。');
    }

    // 残り時間のチェック
    if (userState.taskStartTime && userState.timeLimitSec !== undefined) {
      const elapsed = Math.floor((Date.now() - userState.taskStartTime) / 1000);
      const timeLeft = userState.timeLimitSec - elapsed;
      if (timeLeft <= 0) {
        userState.disqualified = true;
        throw new Error('時間切れで失格しました。');
      }
    }
  }
}

// 共通のコード実行ロジック
function executeCommand(cmd: string, cwd: string, input?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = exec(cmd, { cwd, encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout.trim());
      }
    });
    if (input) {
      child.stdin?.write(input);
      child.stdin?.end();
    }
  });
}

// C#コードのコンパイルと実行
export async function runCsCode(code: string, input: string, userId: string): Promise<string> {
  validateUser(userId);

  const userState = userStates[userId];

  const csFilePath = path.join(tempDir, `Program_${userId}.cs`);
  fs.writeFileSync(csFilePath, code, 'utf8');

  const compileCmd = `csc "${csFilePath}"`;
  const exePath = path.join(tempDir, `Program_${userId}.exe`);
  const runCmd = `"${exePath}"`;

  try {
    await executeCommand(compileCmd, tempDir);
  } catch (compileError) {
    throw new Error(`C#コンパイルエラー:\n${compileError}`);
  }

  try {
    const stdout = await executeCommand(runCmd, tempDir, input);
    if (userState.mode === 'task') {
      writeResultToFile(userId, stdout);
    }
    return stdout;
  } catch (runError) {
    throw new Error(`C#実行エラー:\n${runError}`);
  }
}

// TypeScriptコードのコンパイルと実行
export async function runTsCode(code: string, input: string, userId: string): Promise<string> {
  validateUser(userId);

  const userState = userStates[userId];

  const tsFilePath = path.join(tempDir, `temp_${userId}.ts`);
  fs.writeFileSync(tsFilePath, code, 'utf8');

  const compileCmd = `tsc "${tsFilePath}" --outDir "${tempDir}"`;
  const jsFilePath = path.join(tempDir, `temp_${userId}.js`);
  const runCmd = `node "${jsFilePath}"`;

  try {
    await executeCommand(compileCmd, tempDir);
  } catch (compileError) {
    throw new Error(`TypeScriptコンパイルエラー:\n${compileError}`);
  }

  try {
    const stdout = await executeCommand(runCmd, tempDir, input);
    if (userState.mode === 'task') {
      writeResultToFile(userId, stdout);
    }
    return stdout;
  } catch (runError) {
    throw new Error(`TypeScript実行エラー:\n${runError}`);
  }
}