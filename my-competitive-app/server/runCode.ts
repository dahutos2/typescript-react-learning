import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, '../../temp');

export function runCsCode(code: string, input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const csFilePath = path.join(tempDir, 'Program.cs');
    fs.writeFileSync(csFilePath, code, 'utf8');

    const compileCmd = `csc "${csFilePath}"`;
    const exePath = path.join(tempDir, 'Program.exe');
    const runCmd = `echo "${input}" | "${exePath}"`;

    exec(compileCmd, (compileErr, _stdout, compileStderr) => {
      if (compileErr) {
        return reject(new Error('C#コンパイルエラー:\n' + compileStderr));
      }
      exec(runCmd, (runErr, runStdout, runStderr) => {
        if (runErr) {
          return reject(new Error('C#実行エラー:\n' + runStderr));
        }
        resolve(runStdout);
      });
    });
  });
}

export function runTsCode(code: string, input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const tsFilePath = path.join(tempDir, 'temp.ts');
    fs.writeFileSync(tsFilePath, code, 'utf8');

    const compileCmd = `tsc "${tsFilePath}" --outDir "${tempDir}"`;
    const jsFilePath = path.join(tempDir, 'temp.js');
    const runCmd = `echo "${input}" | node "${jsFilePath}"`;

    exec(compileCmd, (compileErr, _stdout, compileStderr) => {
      if (compileErr) {
        return reject(new Error('TSコンパイルエラー:\n' + compileStderr));
      }
      exec(runCmd, (runErr, runStdout, runStderr) => {
        if (runErr) {
          return reject(new Error('TS実行エラー:\n' + runStderr));
        }
        resolve(runStdout);
      });
    });
  });
}