import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, '../../temp');

// C#コードのコンパイルと実行
export function runCsCode(code: string, input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const csFilePath = path.join(tempDir, 'Program.cs');
    fs.writeFileSync(csFilePath, code, 'utf8');

    const compileCmd = `csc "${csFilePath}"`;
    const exePath = path.join(tempDir, 'Program.exe');
    const runCmd = `"${exePath}"`;

    exec(compileCmd, { cwd: tempDir }, (compileErr, _stdout, compileStderr) => {
      if (compileErr) {
        return reject(new Error('C#コンパイルエラー:\n' + compileStderr));
      }
      // 実行時に入力を渡す
      const child = exec(runCmd, { cwd: tempDir }, (runErr, runStdout, runStderr) => {
        if (runErr) {
          return reject(new Error('C#実行エラー:\n' + runStderr));
        }
        resolve(runStdout.trim());
      });

      // 標準入力にデータを書き込む
      child.stdin?.write(input);
      child.stdin?.end();
    });
  });
}

// TypeScriptコードのコンパイルと実行
export function runTsCode(code: string, input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const tsFilePath = path.join(tempDir, 'temp.ts');
    fs.writeFileSync(tsFilePath, code, 'utf8');

    const compileCmd = `tsc "${tsFilePath}" --outDir "${tempDir}"`;
    const jsFilePath = path.join(tempDir, 'temp.js');
    const runCmd = `node "${jsFilePath}"`;

    exec(compileCmd, { cwd: tempDir }, (compileErr, _stdout, compileStderr) => {
      if (compileErr) {
        return reject(new Error('TypeScriptコンパイルエラー:\n' + compileStderr));
      }
      // 実行時に入力を渡す
      const child = exec(runCmd, { cwd: tempDir }, (runErr, runStdout, runStderr) => {
        if (runErr) {
          return reject(new Error('TypeScript実行エラー:\n' + runStderr));
        }
        resolve(runStdout.trim());
      });

      // 標準入力にデータを書き込む
      child.stdin?.write(input);
      child.stdin?.end();
    });
  });
}
