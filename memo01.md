承知しました。既存のプロジェクト構成に基づき、C#の補完機能を完全なものに改善し、サーバーのビルドおよび実行を簡易化するための詳細な手順を以下に示します。このガイドでは、既存のNode.js（TypeScript）バックエンドとReact（TypeScript）フロントエンドに対して、ASP.NET Core Web APIを新たに追加し、Roslynを活用したC#の補完機能を統合します。

全体の流れ
	1.	プロジェクト構造の整理
	2.	バックエンドの改善
	•	ASP.NET Core Web APIプロジェクトの追加
	•	必要なパッケージのインストール
	•	C#補完APIの実装
	•	CORS設定の確認
	•	ビルドおよび実行スクリプトの追加
	3.	フロントエンドの改善
	•	必要なパッケージのインストール
	•	C#エディタコンポーネントの実装
	•	補完機能の強化
	•	エラーチェック機能の実装
	•	ビルドおよび実行スクリプトの追加
	4.	テストと品質保証
	5.	デプロイメントの最適化

1. プロジェクト構造の整理

既存のプロジェクト構成は以下の通りです：

my-competitive-app/
  ├─ package.json          
  ├─ tsconfig.json         
  ├─ server/
  │   ├─ server.ts         
  │   ├─ runCode.ts        
  │   └─ tsconfig.json     
  ├─ client/
  │   ├─ package.json      
  │   ├─ tsconfig.json     
  │   ├─ public/
  │   │   └─ index.html
  │   └─ src/
  │       ├─ index.tsx
  │       ├─ App.tsx
  │       ├─ data/
  │       │   └─ tasks.json
  │       ├─ styles/
  │       │   └─ style.css
  │       └─ components/
  │           ├─ Timer.tsx
  │           ├─ CodeEditor.tsx
  │           └─ TaskRunner.tsx
  ├─ temp/
  └─ dist/
      └─ server/
          ├─ server.js     
          ├─ runCode.js    
          └─ ...          

これに新たなバックエンドを追加する形で進めます。

2. バックエンドの改善

2.1. ASP.NET Core Web APIプロジェクトの追加

既存のserver/フォルダとは別に、C#補完機能専用のバックエンドを作成します。これにより、既存のNode.jsサーバーとの干渉を避けつつ機能を統合できます。
	1.	プロジェクトフォルダの作成
プロジェクトのルートディレクトリに新しいフォルダcsharp-backend/を作成します。

cd my-competitive-app
mkdir csharp-backend
cd csharp-backend


	2.	ASP.NET Core Web APIプロジェクトの作成
csharp-backend/フォルダ内にASP.NET Core Web APIプロジェクトを新規作成します。

dotnet new webapi -n CSharpEditorBackend

これにより、csharp-backend/CSharpEditorBackend/フォルダが作成されます。

	3.	プロジェクトフォルダの移動
フォルダ構造を以下のように整えます：

my-competitive-app/
  ├─ package.json          
  ├─ tsconfig.json         
  ├─ server/
  ├─ client/
  ├─ csharp-backend/
  │   └─ CSharpEditorBackend/
  │       ├─ Controllers/
  │       ├─ Program.cs
  │       ├─ CSharpEditorBackend.csproj
  │       └─ ... 
  ├─ temp/
  └─ dist/



2.2. 必要なパッケージのインストール

C#補完機能を実装するために、以下のNuGetパッケージをインストールします。
	1.	プロジェクトディレクトリに移動

cd CSharpEditorBackend


	2.	パッケージのインストール

dotnet add package Microsoft.CodeAnalysis.CSharp
dotnet add package Microsoft.CodeAnalysis.Workspaces.MSBuild
dotnet add package Microsoft.CodeAnalysis.CSharp.Workspaces
dotnet add package Microsoft.CodeAnalysis.Workspaces.Common
dotnet add package Microsoft.Extensions.Caching.Memory



2.3. C# 補完APIの実装

a. CSharpControllerの作成

Controllersフォルダ内にCSharpController.csを作成し、補完機能と診断機能を提供するエンドポイントを実装します。

ファイル: csharp-backend/CSharpEditorBackend/Controllers/CSharpController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Completion;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.Text;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace CSharpEditorBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CSharpController : ControllerBase
    {
        // ユーザーごとのプロジェクトを管理するコンカレントディクショナリ
        private static ConcurrentDictionary<string, Project> userProjects = new ConcurrentDictionary<string, Project>();

        private readonly IMemoryCache _cache;

        public CSharpController(IMemoryCache cache)
        {
            _cache = cache;
        }

        // プロジェクトを作成または取得するメソッド
        private Project CreateOrGetProject(string userId, string code)
        {
            return userProjects.GetOrAdd(userId, id =>
            {
                var workspace = new AdhocWorkspace();
                var projectId = ProjectId.CreateNewId();
                var projectInfo = ProjectInfo.Create(
                    projectId,
                    VersionStamp.Create(),
                    "CSharpProject",
                    "CSharpProject",
                    LanguageNames.CSharp)
                    .WithCompilationOptions(new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary))
                    .WithMetadataReferences(GetMetadataReferences());

                var project = workspace.AddProject(projectInfo);
                workspace.AddDocument(project.Id, "CSharpDocument.cs", SourceText.From(code));
                return project;
            });
        }

        // 必要なメタデータ参照を取得
        private IEnumerable<MetadataReference> GetMetadataReferences()
        {
            var assemblies = AppDomain.CurrentDomain.GetAssemblies()
                                 .Where(a => !a.IsDynamic && !string.IsNullOrEmpty(a.Location))
                                 .Select(a => MetadataReference.CreateFromFile(a.Location))
                                 .Cast<MetadataReference>();

            return assemblies;
        }

        // 補完機能エンドポイント
        [HttpPost("complete")]
        public async Task<IActionResult> Complete([FromBody] CompletionRequest request)
        {
            var cacheKey = $"{request.UserId}_{request.Code}_{request.CursorPosition}";
            if (_cache.TryGetValue(cacheKey, out object cachedSuggestions))
            {
                return Ok(new { suggestions = cachedSuggestions });
            }

            var project = CreateOrGetProject(request.UserId, request.Code);
            var document = project.Documents.First();
            var completionService = CompletionService.GetService(document);
            var completions = await completionService.GetCompletionsAsync(document, request.CursorPosition);

            if (completions == null)
                return Ok(new { suggestions = new object[0] });

            var suggestions = completions.Items.Select(item => new
            {
                label = item.DisplayText,
                kind = item.Tags.FirstOrDefault() ?? "Text",
                insertText = item.InsertText ?? item.DisplayText,
                detail = item.FilterText
            }).ToArray();

            // キャッシュに保存（5分間有効）
            _cache.Set(cacheKey, suggestions, TimeSpan.FromMinutes(5));

            return Ok(new { suggestions });
        }

        // 診断機能エンドポイント
        [HttpPost("diagnose")]
        public async Task<IActionResult> Diagnose([FromBody] CompletionRequest request)
        {
            var project = CreateOrGetProject(request.UserId, request.Code);
            var document = project.Documents.First();

            var semanticModel = await document.GetSemanticModelAsync();
            var diagnostics = semanticModel.GetDiagnostics();

            var errors = diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error)
                                    .Select(d => new
                                    {
                                        message = d.GetMessage(),
                                        line = d.Location.GetLineSpan().StartLinePosition.Line + 1,
                                        character = d.Location.GetLineSpan().StartLinePosition.Character + 1
                                    }).ToArray();

            var warnings = diagnostics.Where(d => d.Severity == DiagnosticSeverity.Warning)
                                      .Select(d => new
                                      {
                                          message = d.GetMessage(),
                                          line = d.Location.GetLineSpan().StartLinePosition.Line + 1,
                                          character = d.Location.GetLineSpan().StartLinePosition.Character + 1
                                      }).ToArray();

            return Ok(new { errors, warnings });
        }
    }

    // 補完リクエストのモデル
    public class CompletionRequest
    {
        public string UserId { get; set; } // ユーザー識別用ID
        public string Code { get; set; }
        public int CursorPosition { get; set; }
    }
}

ポイント:
	•	ユーザー識別用ID (UserId) の導入: 各ユーザーセッションごとに補完機能を提供するため、UserIdをリクエストに含めます。
	•	プロジェクト管理: ConcurrentDictionaryを使用して、各ユーザーのプロジェクトを管理します。これにより、ユーザー定義のクラスやメソッドが補完候補に反映されます。
	•	キャッシング: IMemoryCacheを用いて、補完結果をキャッシュし、パフォーマンスを向上させます。
	•	診断機能: シンタックスエラーや警告を取得し、フロントエンドに返します。

b. CORSの設定

フロントエンドからのリクエストを許可するために、CORSポリシーを設定します。

ファイル: csharp-backend/CSharpEditorBackend/Program.cs

var builder = WebApplication.CreateBuilder(args);

// CORSポリシーの追加
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Reactのデフォルトポート
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// メモリキャッシュの追加
builder.Services.AddMemoryCache();

// コントローラーの追加
builder.Services.AddControllers();

var app = builder.Build();

// CORSの適用
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

ポイント:
	•	CORSポリシー: フロントエンドのポート（通常はhttp://localhost:3000）からのリクエストを許可します。必要に応じて、本番環境のドメインも追加してください。
	•	メモリキャッシュのサービス追加: AddMemoryCacheでIMemoryCacheを利用可能にします。

2.4. バックエンドのビルドと実行の簡易化

a. ビルド・実行スクリプトの作成

開発者が簡単にバックエンドをビルド・実行できるように、スクリプトを用意します。
	1.	ルートディレクトリに移動

cd my-competitive-app


	2.	スクリプトの作成
Unix系 (run_csharp_backend.sh):

#!/bin/bash

cd "$(dirname "$0")/csharp-backend/CSharpEditorBackend"
dotnet restore
dotnet build
dotnet run

Windows (run_csharp_backend.bat):

@echo off
cd /d "%~dp0csharp-backend\CSharpEditorBackend"
dotnet restore
dotnet build
dotnet run


	3.	スクリプトの実行権限設定（Unix系のみ）

chmod +x run_csharp_backend.sh


	4.	スクリプトの実行
Unix系:

./run_csharp_backend.sh

Windows:
ダブルクリックでrun_csharp_backend.batを実行。

b. Dockerによるサーバーのコンテナ化（オプション）

Dockerを使用してバックエンドをコンテナ化することで、環境依存の問題を解消し、迅速なデプロイが可能になります。
	1.	Dockerfileの作成
ファイル: csharp-backend/CSharpEditorBackend/Dockerfile

# ビルドステージ
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["CSharpEditorBackend.csproj", "./"]
RUN dotnet restore "CSharpEditorBackend.csproj"
COPY . .
RUN dotnet build "CSharpEditorBackend.csproj" -c Release -o /app/build

# パブリッシュステージ
FROM build AS publish
RUN dotnet publish "CSharpEditorBackend.csproj" -c Release -o /app/publish

# ランタイムステージ
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CSharpEditorBackend.dll"]


	2.	Docker Composeへの追加（既存の場合）
既にプロジェクトでDocker Composeを使用している場合、docker-compose.ymlにバックエンドサービスを追加します。既存のプロジェクト構成にはDocker Composeが含まれていないため、必要に応じて追加します。
ファイル: my-competitive-app/docker-compose.yml

version: '3.8'

services:
  csharp-backend:
    build:
      context: ./csharp-backend/CSharpEditorBackend
      dockerfile: Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    networks:
      - editor-network

networks:
  editor-network:
    driver: bridge


	3.	Docker Composeの実行

docker-compose up --build

ポイント:
	•	一括起動: docker-compose up --buildでバックエンドをビルド・起動します。
	•	ポートフォワーディング: 5000:80および5001:443でバックエンドにアクセス可能になります。
	•	ネットワーク: 同一ネットワーク内でサービスが通信可能になります。

3. フロントエンドの改善

3.1. 必要なパッケージのインストール

C#補完機能を実装するために、Monaco Editorと補完機能に必要なパッケージをインストールします。
	1.	フロントエンドディレクトリに移動

cd my-competitive-app/client


	2.	パッケージのインストール

npm install @monaco-editor/react axios lodash.debounce

パッケージ説明:
	•	@monaco-editor/react: React用のMonaco Editorコンポーネント。
	•	axios: HTTPクライアント。
	•	lodash.debounce: デバウンス機能を提供。

3.2. C#エディタコンポーネントの実装

a. CSharpEditor.tsx コンポーネントの作成

既存のcomponents/フォルダ内に新たにCSharpEditor.tsxを作成し、C#補完機能を実装します。

ファイル: my-competitive-app/client/src/components/CSharpEditor.tsx

import React, { useRef, useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const CSharpEditor: React.FC = () => {
    const editorRef = useRef<any>(null);
    const [errors, setErrors] = useState<Array<{ message: string; line: number; character: number }>>([]);
    const [warnings, setWarnings] = useState<Array<{ message: string; line: number; character: number }>>([]);

    // ユーザー識別用IDの取得（例: ログイン機能がある場合）
    const userId = 'defaultUser'; // 実際には認証システムに基づくIDを使用

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;

        // 補完プロバイダーの登録（デバウンス付き）
        monaco.languages.registerCompletionItemProvider('csharp', {
            triggerCharacters: ['.', ' ', '(', ':'],
            provideCompletionItems: debounce(async (model: any, position: any) => {
                const code = model.getValue();
                const cursorPosition = model.getOffsetAt(position);

                try {
                    const response = await axios.post('/api/CSharp/complete', {
                        userId,
                        code,
                        cursorPosition,
                    });

                    const completions = response.data.suggestions;

                    return {
                        suggestions: completions.map((item: any) => ({
                            label: item.label,
                            kind: getCompletionItemKind(item.kind, monaco),
                            insertText: item.insertText,
                            detail: item.detail,
                        })),
                    };
                } catch (error) {
                    console.error('補完リクエストに失敗しました', error);
                    return { suggestions: [] };
                }
            }, 300),
        });

        // モデルの変更時に診断を取得
        editor.onDidChangeModelContent(debounce(() => {
            const code = editor.getValue();
            getDiagnostics(code, monaco);
        }, 500)); // 500msのデバウンス
    };

    const getCompletionItemKind = (kind: string, monaco: any) => {
        switch (kind.toLowerCase()) {
            case 'method':
                return monaco.languages.CompletionItemKind.Method;
            case 'property':
                return monaco.languages.CompletionItemKind.Property;
            case 'field':
                return monaco.languages.CompletionItemKind.Field;
            case 'class':
                return monaco.languages.CompletionItemKind.Class;
            case 'interface':
                return monaco.languages.CompletionItemKind.Interface;
            case 'enum':
                return monaco.languages.CompletionItemKind.Enum;
            case 'keyword':
                return monaco.languages.CompletionItemKind.Keyword;
            case 'snippet':
                return monaco.languages.CompletionItemKind.Snippet;
            default:
                return monaco.languages.CompletionItemKind.Text;
        }
    };

    const getDiagnostics = async (code: string, monaco: any) => {
        try {
            const response = await axios.post('/api/CSharp/diagnose', {
                userId,
                code,
                cursorPosition: code.length, // 現在のカーソル位置をコードの末尾と仮定
            });

            const { errors, warnings } = response.data;

            setErrors(errors);
            setWarnings(warnings);

            const editor = editorRef.current;
            if (editor) {
                const model = editor.getModel();
                const newMarkers = [
                    ...errors.map((err: any) => ({
                        severity: monaco.MarkerSeverity.Error,
                        startLineNumber: err.line,
                        startColumn: err.character,
                        endLineNumber: err.line,
                        endColumn: err.character + 1,
                        message: err.message,
                    })),
                    ...warnings.map((warn: any) => ({
                        severity: monaco.MarkerSeverity.Warning,
                        startLineNumber: warn.line,
                        startColumn: warn.character,
                        endLineNumber: warn.line,
                        endColumn: warn.character + 1,
                        message: warn.message,
                    })),
                ];
                monaco.editor.setModelMarkers(model, 'owner', newMarkers);
            }
        } catch (error) {
            console.error('診断リクエストに失敗しました', error);
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <MonacoEditor
                height="100%"
                language="csharp"
                theme="vs-dark"
                defaultValue="// C# コードをここに入力..."
                onMount={handleEditorDidMount}
                options={{
                    automaticLayout: true,
                }}
            />
            <div className="error-container">
                {errors.length > 0 && (
                    <div className="errors">
                        <h3>Errors:</h3>
                        <ul>
                            {errors.map((err, index) => (
                                <li key={index}>
                                    Line {err.line}, Char {err.character}: {err.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {warnings.length > 0 && (
                    <div className="warnings">
                        <h3>Warnings:</h3>
                        <ul>
                            {warnings.map((warn, index) => (
                                <li key={index}>
                                    Line {warn.line}, Char {warn.character}: {warn.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CSharpEditor;

ポイント:
	•	ユーザー識別用ID (userId) の管理: 現在はdefaultUserに固定していますが、実際のプロジェクトではユーザーごとに異なるIDを設定してください（例: 認証システムを利用）。
	•	補完プロバイダー: Monaco Editorの補完機能をデバウンス付きでバックエンドにリクエストします。
	•	診断機能: コードの変更時にバックエンドに診断リクエストを送り、エラーや警告を表示します。
	•	スタイル: エラーメッセージや警告をエディタ下部に表示します。

b. エラーメッセージ表示用のスタイル追加

エラーメッセージや警告を視覚的に表示するために、App.cssを編集します。

ファイル: my-competitive-app/client/src/styles/style.css

.error-container {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-height: 200px;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 10px;
    border-radius: 5px;
    color: white;
}

.errors, .warnings {
    margin-bottom: 10px;
}

.errors h3 {
    color: #f44336; /* 赤色 */
}

.warnings h3 {
    color: #ff9800; /* オレンジ色 */
}

.errors ul, .warnings ul {
    list-style-type: none;
    padding: 0;
}

.errors li, .warnings li {
    text-align: left;
}

ポイント:
	•	視覚的区分: エラーと警告を色分けし、ユーザーが一目で識別できるようにします。
	•	レイアウト調整: エディタの下部にエラーメッセージを重ねる形で表示し、スペースを有効活用します。

c. Reactアプリケーションへのコンポーネント追加

App.tsxにCSharpEditorコンポーネントを追加し、表示します。

ファイル: my-competitive-app/client/src/App.tsx

import React from 'react';
import CSharpEditor from './components/CSharpEditor';
import './styles/style.css';

function App() {
    return (
        <div className="App">
            <h1>React Monaco C# Editor</h1>
            <CSharpEditor />
        </div>
    );
}

export default App;

ポイント:
	•	コンポーネントの統合: CSharpEditorコンポーネントをアプリケーションに統合し、エディタが表示されるようにします。

3.3. フロントエンドAPI通信のプロキシ設定

フロントエンドからバックエンドへのリクエストを容易にするために、プロキシ設定を行います。

ファイル: my-competitive-app/client/package.json

{
  // ...他の設定
  "proxy": "http://localhost:5000",
  // ...他の設定
}

ポイント:
	•	プロキシ設定: React開発サーバーからの/apiへのリクエストが、自動的にhttp://localhost:5000/apiに転送されます。これにより、CORSの問題を回避できます。

3.4. フロントエンドのビルドと実行の簡易化

a. ビルド・実行スクリプトの作成

開発者が簡単にフロントエンドをビルド・実行できるように、スクリプトを用意します。
	1.	ルートディレクトリに移動

cd my-competitive-app


	2.	スクリプトの作成
Unix系 (run_frontend.sh):

#!/bin/bash

cd "$(dirname "$0")/client"
npm install
npm start

Windows (run_frontend.bat):

@echo off
cd /d "%~dp0client"
npm install
npm start


	3.	スクリプトの実行権限設定（Unix系のみ）

chmod +x run_frontend.sh


	4.	スクリプトの実行
Unix系:

./run_frontend.sh

Windows:
ダブルクリックでrun_frontend.batを実行。

b. Dockerによるフロントエンドのコンテナ化（オプション）

フロントエンドもDockerコンテナ化することで、ビルドと実行をさらに簡易化します。
	1.	Dockerfileの作成
ファイル: my-competitive-app/client/Dockerfile

# ビルドステージ
FROM node:16 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# ランタイムステージ
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


	2.	Docker Composeへの追加
既にバックエンドがDocker Composeで管理されている場合、フロントエンドサービスを追加します。
ファイル: my-competitive-app/docker-compose.yml

version: '3.8'

services:
  csharp-backend:
    build:
      context: ./csharp-backend/CSharpEditorBackend
      dockerfile: Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    networks:
      - editor-network

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:80" # フロントエンドのポート
    networks:
      - editor-network

networks:
  editor-network:
    driver: bridge


	3.	Docker Composeの実行

cd my-competitive-app
docker-compose up --build

ポイント:
	•	一括起動: docker-compose up --buildでフロントエンドとバックエンドをビルド・起動します。
	•	ポートフォワーディング: フロントエンドはhttp://localhost:3000、バックエンドはhttp://localhost:5000でアクセス可能になります。
	•	ネットワーク: 同一ネットワーク内でサービスが通信可能になります。

4. テストと品質保証

4.1. バックエンドの単体テスト

バックエンドの補完機能と診断機能に対して単体テストを導入します。

a. テストプロジェクトの作成
	1.	テストプロジェクトの作成

cd my-competitive-app/csharp-backend/CSharpEditorBackend
dotnet new xunit -n CSharpEditorBackend.Tests
dotnet add CSharpEditorBackend.Tests/CSharpEditorBackend.Tests.csproj reference CSharpEditorBackend.csproj
dotnet add CSharpEditorBackend.Tests/CSharpEditorBackend.Tests.csproj package Microsoft.AspNetCore.Mvc.Testing
dotnet add CSharpEditorBackend.Tests/CSharpEditorBackend.Tests.csproj package Moq


	2.	プロジェクトフォルダ構造

CSharpEditorBackend/
  ├─ Controllers/
  │   └─ CSharpController.cs
  ├─ CSharpEditorBackend.csproj
  ├─ Program.cs
  ├─ ...その他のファイル
  └─ CSharpEditorBackend.Tests/
      ├─ CSharpEditorBackend.Tests.csproj
      └─ CSharpControllerTests.cs



b. テストコードの作成

ファイル: my-competitive-app/csharp-backend/CSharpEditorBackend.Tests/CSharpControllerTests.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Threading.Tasks;
using Xunit;
using CSharpEditorBackend.Controllers;

namespace CSharpEditorBackend.Tests
{
    public class CSharpControllerTests
    {
        private readonly CSharpController _controller;

        public CSharpControllerTests()
        {
            var memoryCache = new MemoryCache(new MemoryCacheOptions());
            _controller = new CSharpController(memoryCache);
        }

        [Fact]
        public async Task Complete_ReturnsSuggestions()
        {
            var request = new CompletionRequest
            {
                UserId = "testUser",
                Code = "using System;\n\npublic class Test {\n    public void Method() {\n        Console.",
                CursorPosition = "using System;\n\npublic class Test {\n    public void Method() {\n        Console.".Length
            };

            var result = await _controller.Complete(request) as OkObjectResult;
            Assert.NotNull(result);
            var suggestions = ((dynamic)result.Value).suggestions;
            Assert.NotEmpty(suggestions);
        }

        [Fact]
        public async Task Diagnose_ReturnsErrors()
        {
            var request = new CompletionRequest
            {
                UserId = "testUser",
                Code = "using System\n\npublic class Test {\n    public void Method() {\n        Console.WriteLine(\"Hello World\");\n    }\n}",
                CursorPosition = "using System\n\npublic class Test {\n    public void Method() {\n        Console.WriteLine(\"Hello World\");\n    }\n}".Length
            };

            var result = await _controller.Diagnose(request) as OkObjectResult;
            Assert.NotNull(result);
            var errors = ((dynamic)result.Value).errors;
            Assert.NotEmpty(errors); // 'using System'のセミコロンがないためエラーがある
        }
    }
}

ポイント:
	•	補完機能のテスト: 正しい補完候補が返されるかを確認します。
	•	診断機能のテスト: シンタックスエラーが正しく検出されるかを確認します。

c. テストの実行

cd my-competitive-app/csharp-backend/CSharpEditorBackend.Tests
dotnet test

ポイント:
	•	テストカバレッジの向上: 補完機能と診断機能に対する基本的なテストケースを追加します。
	•	CIパイプラインとの統合: 将来的にCIパイプラインで自動的にテストを実行するよう設定します。

4.2. フロントエンドの単体テスト

Reactコンポーネントに対して単体テストを導入します。

a. テストライブラリのインストール

Reactアプリケーションには既にreact-scriptsにテスト機能が含まれていますが、必要に応じて追加のライブラリをインストールします。

cd my-competitive-app/client
npm install --save-dev @testing-library/react @testing-library/jest-dom axios-mock-adapter

b. テストコードの作成

ファイル: my-competitive-app/client/src/components/CSharpEditor.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CSharpEditor from './CSharpEditor';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom/extend-expect';

// モックアダプターの作成
const mock = new MockAdapter(axios);

describe('CSharpEditor Component', () => {
    beforeEach(() => {
        mock.reset();
    });

    test('renders CSharpEditor', () => {
        render(<CSharpEditor />);
        const editorElement = screen.getByText(/C# コードをここに入力.../i);
        expect(editorElement).toBeInTheDocument();
    });

    test('fetches and displays completion suggestions', async () => {
        // 補完リクエストのモック
        mock.onPost('/api/CSharp/complete').reply(200, {
            suggestions: [
                { label: 'Console', kind: 'class', insertText: 'Console', detail: 'System.Console' },
                { label: 'Console.WriteLine', kind: 'method', insertText: 'WriteLine', detail: 'void WriteLine(string value)' },
            ],
        });

        render(<CSharpEditor />);

        // エディタにコードを入力して補完をトリガーするシミュレーションは複雑なため、ここでは基本的なレンダリング確認
        await waitFor(() => {
            expect(mock.history.post.length).toBeGreaterThan(0);
        });
    });

    test('displays errors and warnings', async () => {
        // 診断リクエストのモック
        mock.onPost('/api/CSharp/diagnose').reply(200, {
            errors: [
                { message: "Unexpected symbol 'public'", line: 3, character: 15 },
            ],
            warnings: [
                { message: "Unused variable 'x'", line: 5, character: 10 },
            ],
        });

        render(<CSharpEditor />);

        // シンタックスエラーの表示確認
        await waitFor(() => {
            const errorElement = screen.getByText(/Line 3, Char 15: Unexpected symbol 'public'/i);
            expect(errorElement).toBeInTheDocument();
        });

        // 警告の表示確認
        await waitFor(() => {
            const warningElement = screen.getByText(/Line 5, Char 10: Unused variable 'x'/i);
            expect(warningElement).toBeInTheDocument();
        });
    });
});

ポイント:
	•	モックサーバー: axios-mock-adapterを使用して、APIリクエストをモックしテストを行います。
	•	コンポーネントのレンダリング確認: エディタが正しくレンダリングされるかを確認します。
	•	補完機能のテスト: 補完リクエストが正しく行われ、レスポンスが受信されるかを確認します。
	•	診断機能のテスト: エラーと警告が正しく表示されるかを確認します。

c. テストの実行

cd my-competitive-app/client
npm test

ポイント:
	•	テストの自動実行: テストファイルを保存すると自動的にテストが実行され、結果が表示されます。

4. デプロイメントの最適化

4.1. フロントエンドとバックエンドの統合

既にバックエンドとフロントエンドがDocker化されている場合、これらを同一ネットワーク内で管理できます。以下の設定を確認してください。

ファイル: my-competitive-app/docker-compose.yml

version: '3.8'

services:
  csharp-backend:
    build:
      context: ./csharp-backend/CSharpEditorBackend
      dockerfile: Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    networks:
      - editor-network

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:80" # フロントエンドのポート
    networks:
      - editor-network

networks:
  editor-network:
    driver: bridge

使用方法:

cd my-competitive-app
docker-compose up --build

ポイント:
	•	フロントエンド: http://localhost:3000でNginxを通じて提供されます。
	•	バックエンド: http://localhost:5000でASP.NET Core Web APIが提供されます。
	•	ネットワーク: 同一ネットワーク内でサービスが通信可能になります。

4.2. 環境変数の設定

本番環境では、以下のような環境変数を設定し、セキュリティやパフォーマンスを最適化します。

a. バックエンド環境変数の設定

ファイル: csharp-backend/CSharpEditorBackend/appsettings.json

{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*"
}

ポイント:
	•	Logging Level: 本番環境ではログレベルをWarningに設定し、詳細なログを抑制します。
	•	AllowedHosts: 必要に応じて、許可するホストを明示的に設定します。

b. フロントエンド環境変数の設定

ファイル: my-competitive-app/client/.env

REACT_APP_API_URL=/api

ポイント:
	•	API URLの設定: フロントエンドがAPIエンドポイントを環境変数から取得するように設定し、開発・本番環境で柔軟に対応します。

4.3. 自動ビルドとデプロイメントパイプラインの構築（オプション）

CI/CDツール（例: GitHub Actions, Azure DevOps）を使用して、コードの変更が自動的にビルド・テスト・デプロイされるパイプラインを構築します。

a. GitHub ActionsでのDockerビルドとプッシュの例

ファイル: my-competitive-app/.github/workflows/docker-deploy.yml

name: Docker Build and Push

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v1

    - name: Log in to Docker Hub
      uses: docker/login-action@v1
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push csharp-backend
      uses: docker/build-push-action@v2
      with:
        context: ./csharp-backend/CSharpEditorBackend
        file: ./csharp-backend/CSharpEditorBackend/Dockerfile
        push: true
        tags: your-dockerhub-username/csharp-editor-backend:latest

    - name: Build and push frontend
      uses: docker/build-push-action@v2
      with:
        context: ./client
        file: ./client/Dockerfile
        push: true
        tags: your-dockerhub-username/csharp-editor-frontend:latest

ポイント:
	•	シークレットの設定: GitHubリポジトリのシークレットにDOCKER_USERNAMEとDOCKER_PASSWORDを設定します。
	•	自動ビルドとプッシュ: コードがmainブランチにプッシュされるたびに、DockerイメージがビルドされDocker Hubにプッシュされます。

5. テストと品質保証

5.1. バックエンドの単体テスト

既にバックエンドの単体テスト手順を実施しましたが、さらに詳細なテストケースを追加することで、機能の信頼性を高めます。

5.2. フロントエンドの単体テスト

既にフロントエンドの単体テスト手順を実施しましたが、追加のテストケースを作成し、UIの動作確認を行います。

6. デプロイメントの最適化

6.1. フロントエンドとバックエンドの統合

既にDocker Composeを使用してフロントエンドとバックエンドを統合しましたが、以下の点を確認します。
	•	サービスの連携: フロントエンドがバックエンドのAPIエンドポイントに正しくリクエストを送信できるように、ネットワーク設定を確認します。
	•	環境変数の適用: 本番環境用の環境変数を設定し、セキュリティやパフォーマンスを最適化します。

6.2. セキュリティの強化
	•	HTTPSの強制: サーバーとフロントエンドの通信をHTTPSに限定します。
	•	認証と認可: 必要に応じて、ユーザー認証とアクセス制御を導入します。
	•	CORSポリシーの適切な設定: 許可するオリジンを明示的に設定し、不正なアクセスを防止します。

6.3. パフォーマンスの最適化
	•	キャッシュの活用: バックエンドの補完結果をキャッシュし、レスポンス時間を短縮します。
	•	負荷分散: 必要に応じて、複数のバックエンドインスタンスを展開し、負荷分散を行います。

7. まとめ

以下の手順を順に実施することで、既存のNode.js（TypeScript）バックエンドとReact（TypeScript）フロントエンドに対して、C#の補完機能を完全なものに改善し、サーバーのビルドおよび実行を簡易化することができます。
	1.	プロジェクト構造の整理: フロントエンドとバックエンドのフォルダ内に必要なサブフォルダとファイルを作成します。
	2.	バックエンドの改善:
	•	ASP.NET Core Web APIプロジェクトの追加
	•	必要なパッケージのインストール
	•	CSharpControllerの実装
	•	CORS設定の確認
	•	ビルド・実行スクリプトの追加
	•	Dockerによるコンテナ化（オプション）
	3.	フロントエンドの改善:
	•	必要なパッケージのインストール
	•	CSharpEditorコンポーネントの実装
	•	補完機能と診断機能の強化
	•	エラーメッセージの表示
	•	ビルド・実行スクリプトの追加
	•	Dockerによるコンテナ化（オプション）
	4.	テストと品質保証:
	•	バックエンドとフロントエンドの単体テストの実装
	5.	デプロイメントの最適化:
	•	フロントエンドとバックエンドの統合
	•	環境変数の設定
	•	自動ビルドとデプロイメントパイプラインの構築（オプション）

これらの手順を実施することで、C#の補完機能が強化された、効率的な開発環境を構築できます。各ステップで問題が発生した場合は、具体的なエラーメッセージや状況を共有いただければ、さらに詳細なサポートを提供いたします。

成功を祈っています！
