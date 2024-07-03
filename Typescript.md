# TypeScript基礎演習
## 1. 環境構築
#### VsCodeのセットアップ
##### 1. VsCodeのインストール
VsCodeをインストールします。
##### 2. 拡張機能の追加
リンク先の説明を読み、以下の拡張機能をVsCodeにインストールしてください。
※説明が長いですので、最初の10行程度を読めば十分です。
1. [Japanese Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-ja): 日本語化。
2. [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons): ファイルのアイコンセット。
3. [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): コード自動整形ツール。
4. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): 静的解析。
5. [IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode): コードを予測し、自動入力。
6. [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker): タイポ防止。
7. [C# to TypeScript](https://marketplace.visualstudio.com/items?itemName=adrianwilczynski.csharp-to-typescript): C#のコードをTypeScriptに変換
#### TypeScriptのセットアップ
##### 1. Node.jsのインストール
まず、Node.jsをインストールします。

##### 2. プロジェクトのセットアップ
1. **プロジェクトディレクトリの作成と初期化**
   - プロジェクトディレクトリを作成します。
   ※プロジェクトを配置するフォルダ名に日本語が含まれないようにしてください。[(*1)](https://developercommunity.visualstudio.com/t/日本語名のフォルダにプロジェクトファイルが存在すると、コンパイラがIFCファイルを作成できない/1220698)
     ```bash
     # フォルダの作成
     mkdir my-typescript-project

     # フォルダ直下に移動
     cd my-typescript-project
     ```
   - npm初期化
     ```bash
     npm init -y
     ```

2. **TypeScriptのインストール**
   - プロジェクトにTypeScriptをインストールします。
     ```bash
     npm install typescript --save-dev
     ```

3. **ts-nodeのインストール**
   - TypeScriptファイルを直接実行できるようにするために、ts-nodeをインストールします。
     ```bash
     npm install ts-node --save-dev
     ```

4. **TypeScript設定ファイルの作成**
   - `tsconfig.json`ファイルを作成します。
     ```bash
     npx tsc --init
     ```

5. **ESLintのインストールと設定**
   - ESLintとTypeScript用のパーサー、プラグインをインストールします。
     ```bash
     # npm WARNが発生する場合も無視して進めてください。
     npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
     ```

   - `npx eslint --init`を実行して基本設定を行います。設定内容は以下の通りです。
     - How would you like to use ESLint? **To check syntax, find problems, and enforce code style**
     - What type of modules does your project use? **JavaScript modules (import/export)**
     - Which framework does your project use? **None of these**
     - Does your project use TypeScript? **Yes**
     - Where does your code run? **Node**
     - What format do you want your config file to be in? **JavaScript**

6. **ESLint設定ファイルの修正**
   - `.eslintrc.js` ファイルを以下のように修正します。
     ```javascript
     module.exports = {
       env: {
         node: true,
         es2021: true,
       },
       extends: [
         'eslint:recommended',
         'plugin:@typescript-eslint/recommended',
       ],
       parser: '@typescript-eslint/parser',
       parserOptions: {
         ecmaVersion: 12,
         sourceType: 'module',
       },
       plugins: [
         '@typescript-eslint',
       ],
       rules: {
         'no-console': 'warn',
         'semi': ['error', 'always'],
         'quotes': ['error', 'single'],
       },
     };
     ```

7. **VSCode設定**
   - VSCodeの設定ファイル（`settings.json`）に以下を追加して、ESLintとPrettierが正しく動作するように設定します。
     ```json
     {
       "editor.formatOnSave": true,
       "editor.codeActionsOnSave": {
         "source.fixAll.eslint": true
       },
       "files.autoSave": "onFocusChange",
       "eslint.validate": [
         "javascript",
         "typescript"
       ],
       "typescript.tsdk": "node_modules/typescript/lib"
     }
     ```

##### 3. サンプルプロジェクトの作成

1. **TypeScriptファイルの作成**
   - `src`ディレクトリを作成し、`index.ts`ファイルを作成します。
     ```bash
     mkdir src
     touch src/index.ts
     ```

2. **サンプルコードの追加**
   - `src/index.ts`に以下のサンプルコードを追加します。
     ```typescript
     const greeting: string = 'Hello, TypeScript!';
     console.log(greeting);
     ```

3. **実行スクリプトの追加**
   - `package.json`の`scripts`セクションに以下を追加します。
     ```json
     "scripts": {
       "start": "ts-node src/index.ts"
     }
     ```

4. **プロジェクトの実行**
   - 以下のコマンドでプロジェクトを実行します。
     ```bash
     npm start
     ```

###### 期待する出力
```bash
Hello, TypeScript!
```

## 2. 言語学習

1. **基本的な型**
   - **ドキュメント**: 「サバイバルTypeScript」の「基本的な型」セクションを読む
   - **課題 2**: 
     - 数値、文字列、ブール値を含む変数を定義し、それぞれをコンソールに出力する。
     ```typescript
     let age: number = 25;
     let name: string = "John";
     let isStudent: boolean = true;

     console.log(`Age: ${age}, Name: ${name}, Is Student: ${isStudent}`);
     ```

   - **課題 3**: 
     - 配列とタプルを使用してデータを格納し、コンソールに出力する。
     ```typescript
     let scores: number[] = [90, 80, 70];
     let person: [string, number] = ["Alice", 30];

     console.log(`Scores: ${scores}`);
     console.log(`Person: Name=${person[0]}, Age=${person[1]}`);
     ```

   - **課題 4**: 
     - Enumを定義し、Enumの値を使用してコンソールに出力する。
     ```typescript
     enum Color {
       Red,
       Green,
       Blue
     }
     let favoriteColor: Color = Color.Green;

     console.log(`Favorite Color: ${favoriteColor}`);
     ```

2. **オブジェクトとインターフェース**
   - **ドキュメント**: 「サバイバルTypeScript」の「オブジェクトとインターフェース」セクションを読む
   - **課題 5**: 
     - インターフェースを使用してオブジェクト型を定義し、そのオブジェクトを使用する。
     ```typescript
     interface Person {
       name: string;
       age: number;
     }

     let person: Person = {
       name: "Bob",
       age: 25
     };

     console.log(`Name: ${person.name}, Age: ${person.age}`);
     ```

   - **課題 6**: 
     - インターフェースを拡張して、新しいプロパティを追加し、それを使用する。
     ```typescript
     interface Person {
       name: string;
       age: number;
     }

     interface Employee extends Person {
       jobTitle: string;
     }

     let employee: Employee = {
       name: "Alice",
       age: 30,
       jobTitle: "Developer"
     };

     console.log(`Name: ${employee.name}, Age: ${employee.age}, Job Title: ${employee.jobTitle}`);
     ```

3. **クラスとモジュール**
   - **ドキュメント**: 「サバイバルTypeScript」の「クラスとモジュール」セクションを読む
   - **課題 7**: 
     - クラスを定義し、インスタンスを作成してメソッドを呼び出す。
     ```typescript
     class Animal {
       name: string;

       constructor(name: string) {
         this.name = name;
       }

       move(distance: number = 0) {
         console.log(`${this.name} moved ${distance} meters.`);
       }
     }

     let dog = new Animal("Rex");
     dog.move(10);
     ```

   - **課題 8**: 
     - クラスを継承し、新しいクラスを作成してメソッドを追加する。
     ```typescript
     class Animal {
       name: string;

       constructor(name: string) {
         this.name = name;
       }

       move(distance: number = 0) {
         console.log(`${this.name} moved ${distance} meters.`);
       }
     }

     class Dog extends Animal {
       bark() {
         console.log("Woof! Woof!");
       }
     }

     let dog = new Dog("Rex");
     dog.bark();
     dog.move(10);
     ```

   - **課題 9**: 
     - モジュールを使用してクラスを別ファイルに分割し、インポートして使用する。
     ```typescript
     // ファイル: animal.ts
     export class Animal {
       name: string;

       constructor(name: string) {
         this.name = name;
       }

       move(distance: number = 0) {
         console.log(`${this.name} moved ${distance} meters.`);
       }
     }

     // ファイル: main.ts
     import { Animal } from './animal';

     let lion = new Animal("Leo");
     lion.move(50);
     ```

### 課題1〜4を用いた課題

#### 課題: 基本的な型とデータ構造を使ったユーザー情報の管理

#### 課題の概要
TypeScriptの基本的な型とデータ構造を使って、ユーザー情報を管理する簡単なプログラムを作成します。この課題では、ユーザーの名前、年齢、ステータス（学生かどうか）を格納し、これらの情報を出力します。

#### 要件

1. **基本的な型の使用**
   - 数値、文字列、ブール値の変数を定義
   - 配列とタプルを使用してデータを格納
   - Enumを定義して使用

2. **プログラムの作成**
   - 複数のユーザー情報を配列で管理
   - ユーザー情報を出力する関数を作成

#### ステップ

1. **プロジェクトの初期設定**
   ```bash
   mkdir basic-user-management
   cd basic-user-management
   npm init -y
   npm install typescript --save-dev
   npx tsc --init
   ```

2. **基本的な型の使用**
   - `index.ts` ファイルを作成し、基本的な型を定義
     ```typescript
     let age: number = 25;
     let name: string = "John";
     let isStudent: boolean = true;

     console.log(`Age: ${age}, Name: ${name}, Is Student: ${isStudent}`);
     ```

3. **配列とタプルの使用**
   ```typescript
   let scores: number[] = [90, 80, 70];
   let person: [string, number] = ["Alice", 30];

   console.log(`Scores: ${scores}`);
   console.log(`Person: Name=${person[0]}, Age=${person[1]}`);
   ```

4. **Enumの使用**
   ```typescript
   enum Status {
     Active,
     Inactive,
     Pending
   }

   let userStatus: Status = Status.Active;
   console.log(`User Status: ${userStatus}`);
   ```

5. **ユーザー情報を配列で管理**
   ```typescript
   interface User {
     name: string;
     age: number;
     status: Status;
   }

   let users: User[] = [
     { name: "Alice", age: 30, status: Status.Active },
     { name: "Bob", age: 25, status: Status.Inactive },
     { name: "Charlie", age: 35, status: Status.Pending }
   ];

   function printUsers(users: User[]): void {
     users.forEach(user => {
       console.log(`Name: ${user.name}, Age: ${user.age}, Status: ${Status[user.status]}`);
     });
   }

   printUsers(users);
   ```

6. **コンパイルと実行**
   ```bash
   npx tsc
   node dist/index.js
   ```

### 期待する出力
```bash
Age: 25, Name: John, Is Student: true
Scores: 90,80,70
Person: Name=Alice, Age=30
User Status: 0
Name: Alice, Age: 30, Status: Active
Name: Bob, Age: 25, Status: Inactive
Name: Charlie, Age: 35, Status: Pending
```

### 課題1〜9を用いた課題

#### 課題: TypeScriptで簡単なタスク管理アプリを作成

#### 課題の概要
TypeScriptの基本から応用までを使って、タスク管理アプリを作成します。このアプリでは、タスクの追加、更新、取得、およびリスト表示を行う機能を持つクラスを作成します。

#### 要件

1. **基本的な型の使用**
   - タスク情報を格納するための型を定義
   - 数値、文字列、ブール値、配列、タプル、Enumを使用

2. **オブジェクトとインターフェースの使用**
   - タスク情報を管理するインターフェースを定義
   - タスクの属性をインターフェースで表現

3. **クラスの定義と使用**
   - タスク管理を行うクラスを定義
   - メソッドを実装（タスクの追加、更新、取得、リスト表示）

4. **モジュールの使用**
   - クラスを別ファイルに分割し、インポートして使用

#### ステップ

1. **プロジェクトの初期設定**
   ```bash
   mkdir task-management
   cd task-management
   npm init -y
   npm install typescript --save-dev
   npx tsc --init
   ```

2. **基本的な型の使用**
   - `types.ts` ファイルを作成し、基本的な型を定義
     ```typescript
     export enum Priority {
       Low,
       Medium,
       High
     }

     export type TaskTuple = [string, string, Priority];
     ```

3. **オブジェクトとインターフェースの使用**
   - `interfaces.ts` ファイルを作成し、インターフェースを定義
     ```typescript
     import { Priority } from './types';

     export interface Task {
       id: number;
       title: string;
       description: string;
       priority: Priority;
       completed: boolean;
     }
     ```

4. **クラスの定義と使用**
   - `TaskManager.ts` ファイルを作成し、タスク管理クラスを定義
     ```typescript
     import { Task } from './interfaces';
     import { Priority } from './types';

     class TaskManager {
       private tasks: Task[] = [];

       addTask(task: Task): void {
         this.tasks.push(task);
       }

       updateTask(id: number, updatedTask: Partial<Task>): void {
         const taskIndex = this.tasks.findIndex(task => task.id === id);
         if (taskIndex !== -1) {
           this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
         }
       }

       getTask(id: number): Task | undefined {
         return this.tasks.find(task => task.id === id);
       }

       listTasks(): Task[] {
         return this.tasks;
       }
     }

     export default TaskManager;
     ```

5. **モジュールの使用**
   - `index.ts` ファイルを作成し、クラスをインポートして使用
     ```typescript
     import TaskManager from './TaskManager';
     import { Task, Priority } from './interfaces';

     const taskManager = new TaskManager();

     const task1: Task = { id: 1, title: 'Task 1', description: 'First task', priority: Priority.High, completed: false };
     const task2: Task = { id: 2, title: 'Task 2', description: 'Second task', priority: Priority.Medium, completed: false };

     taskManager.addTask(task1);
     taskManager.addTask(task2);

     console.log('All Tasks:', taskManager.listTasks());

     taskManager.updateTask(1, { completed: true });
     console.log('Updated Task 1:', taskManager.getTask(1));
     ```

6. **コンパイルと実行**
   ```bash
   npx tsc
   node dist/index.js
   ```

### 期待する出力
```bash
All Tasks: [ { id: 1, title: 'Task 1', description: 'First task', priority: 2, completed: false }, { id: 2, title: 'Task 2', description: 'Second task', priority: 1, completed: false } ]
Updated Task 1: { id: 1, title: 'Task 1', description: 'First task', priority: 2, completed: true }
```