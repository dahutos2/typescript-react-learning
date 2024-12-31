import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { UserState, TaskMode, CommandError } from './types';

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
function executeCommand(cmd: string, args: string[], cwd: string, input?: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, shell: true });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      reject(new CommandError(`コマンド実行エラー: ${error.message}`, stdout, stderr));
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new CommandError(`コマンドが非正常終了しました。終了コード: ${code}`, stdout, stderr));
      } else {
        resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      }
    });

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
}

// C#コードのコンパイルと実行
export async function runCsCode(code: string, input: string, userId: string): Promise<string> {
  validateUser(userId);

  const userState = userStates[userId];

  // ユーザーごとのプロジェクトディレクトリを作成
  const projectDir = path.join(tempDir, `Project_${userId}`);

  // プロジェクトディレクトリが存在しない場合は作成し、初期化
  if (!fs.existsSync(projectDir)) {
    try {
      // dotnet new console -o Project_{userId}
      await executeCommand('dotnet', ['new', 'console', '-o', `Project_${userId}`], tempDir);
    } catch (initError: any) {
      throw new Error(`.NET プロジェクトの初期化エラー:\n${initError.stderr || initError.message}`);
    }
  }

  // Program.cs のパス
  const programCsPath = path.join(projectDir, 'Program.cs');

  // ユーザーのC#コードで Program.cs を置き換え
  fs.writeFileSync(programCsPath, code, 'utf8');

  // プロジェクトのビルド
  try {
    const buildResult = await executeCommand('dotnet', ['build', '-c', 'Release'], projectDir);
    if (buildResult.stderr) {
      // 警告のみをサーバー側でログに記録
      console.warn(`Build stderr for user ${userId}: ${buildResult.stderr}`);
    }
  } catch (buildError: any) {
    if (buildError instanceof CommandError) {
      console.error(`C#ビルドエラー for user ${userId}: ${buildError.stderr}`);
      throw new Error(`C#ビルドエラーが発生しました。\n${buildError.stderr}`);
    } else {
      throw new Error(`C#ビルドエラーが発生しました。\n${buildError.message}`);
    }
  }

  // プロジェクトの実行
  try {
    // プロジェクトファイルを正確に指定
    const projectFilePath = path.join(projectDir, `Project_${userId}.csproj`);
    const runCmd = 'dotnet';
    const runArgs = ['run', '--project', `"${projectFilePath}"`, '-c', 'Release'];
    const runResult = await executeCommand(runCmd, runArgs, projectDir, input);

    if (runResult.stderr) {
      // 実行時のエラーをサーバー側でログに記録
      console.error(`Run stderr for user ${userId}: ${runResult.stderr}`);
    }

    if (userState.mode === 'task') {
      writeResultToFile(userId, runResult.stdout);
    }
    return runResult.stdout;
  } catch (runError: any) {
    if (runError instanceof CommandError) {
      console.error(`C#実行エラー for user ${userId}: ${runError.stderr}`);
      throw new Error(`C#実行エラーが発生しました。\n${runError.stderr}`);
    } else {
      throw new Error(`C#実行エラーが発生しました。\n${runError.message}`);
    }
  }
}

// TypeScriptコードのコンパイルと実行
export async function runTsCode(code: string, input: string, userId: string): Promise<string> {
  validateUser(userId);

  const userState = userStates[userId];
  const tsFilePath = path.join(tempDir, `temp_${userId}.ts`);
  const jsFilePath = path.join(tempDir, `temp_${userId}.js`);

  // TypeScript ファイルを保存
  fs.writeFileSync(tsFilePath, code, 'utf8');

  try {
    // TypeScript のコンパイル
    const compileResult = await executeCommand('tsc', [tsFilePath, '--outDir', tempDir], tempDir);
    if (compileResult.stderr) {
      console.warn(`TypeScript Build warnings for user ${userId}: ${compileResult.stderr}`);
    }
  } catch (compileError: any) {
    if (compileError instanceof CommandError) {
      console.error(`TypeScriptコンパイルエラー for user ${userId}: ${compileError.stderr}`);
      throw new Error(`TypeScriptコンパイルエラーが発生しました。\n${compileError.stderr}`);
    } else {
      throw new Error(`TypeScriptコンパイルエラーが発生しました。\n${compileError.message}`);
    }
  }

  try {
    // コンパイル済みの JavaScript ファイルを実行
    const runResult = await executeCommand('node', [jsFilePath], tempDir, input);
    if (runResult.stderr) {
      console.error(`TypeScript Run stderr for user ${userId}: ${runResult.stderr}`);
    }

    if (userState.mode === 'task') {
      writeResultToFile(userId, runResult.stdout);
    }
    return runResult.stdout;
  } catch (runError: any) {
    if (runError instanceof CommandError) {
      console.error(`TypeScript実行エラー for user ${userId}: ${runError.stderr}`);
      throw new Error(`TypeScript実行エラーが発生しました。\n${runError.stderr}`);
    } else {
      throw new Error(`TypeScript実行エラーが発生しました。\n${runError.message}`);
    }
  }
}