using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;
using CodeAnalysisServer.Workspaces;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Formatting;

namespace CodeAnalysisServer.Services
{
    public class CodeFixProvider : ICodeFixProvider
    {
        private readonly IAssemblyProvider _assemblyProvider;

        public CodeFixProvider(IAssemblyProvider assemblyProvider)
        {
            _assemblyProvider = assemblyProvider;
        }

        public async Task<CodeFixResult[]> ProvideAsync(CodeFixRequest request)
        {
            var workspace = new CompletionWorkspace(_assemblyProvider);
            var document = await workspace.CreateDocumentAsync(request.Code);
            if (document == null) return [];

            var semanticModel = await document.GetSemanticModelAsync();
            var syntaxRoot = await document.GetSyntaxRootAsync();

            if (semanticModel == null || syntaxRoot == null) return [];

            var diagnostics = semanticModel.GetDiagnostics().Where(d =>
                d.Severity == DiagnosticSeverity.Error ||
                d.Severity == DiagnosticSeverity.Warning);

            var fixes = new List<CodeFixResult>();

            foreach (var diagnostic in diagnostics)
            {
                // 足りていない using に関する診断をフィルタリング
                if (diagnostic.Id == "CS0246" || diagnostic.Id == "CS1061")
                {
                    var diagnosticSpan = diagnostic.Location.SourceSpan;
                    var node = syntaxRoot.FindNode(diagnosticSpan);

                    var identifierName = node as IdentifierNameSyntax;
                    if (identifierName == null) continue;

                    var missingName = identifierName.Identifier.Text;
                    var compilation = await document.Project.GetCompilationAsync();
                    if (compilation == null) continue;

                    // すべてのメタデータ参照アセンブリを取得
                    foreach (var reference in compilation.References)
                    {
                        if (reference is MetadataReference metadataReference)
                        {
                            var assemblySymbol = compilation.GetAssemblyOrModuleSymbol(metadataReference) as IAssemblySymbol;
                            if (assemblySymbol == null)
                                continue;

                            foreach (var namespaceSymbol in GetAllNamespaces(assemblySymbol.GlobalNamespace))
                            {
                                foreach (var typeSymbol in namespaceSymbol.GetTypeMembers())
                                {
                                    foreach (var member in typeSymbol.GetMembers(missingName))
                                    {
                                        if (member is IMethodSymbol methodSymbol && methodSymbol.Name == missingName)
                                        {
                                            string namespaceToAdd = typeSymbol.ContainingNamespace.ToDisplayString();
                                            Console.WriteLine($"Found method: {methodSymbol.Name} in namespace: {namespaceToAdd}");

                                            // 既にusingが存在するか確認
                                            var compilationUnit = syntaxRoot as CompilationUnitSyntax;
                                            if (compilationUnit == null) continue;

                                            bool alreadyHasUsing = compilationUnit.Usings.Any(u => u.Name?.ToString() == namespaceToAdd);
                                            if (alreadyHasUsing)
                                                continue;

                                            // 既存のusingディレクティブの最後に追加
                                            var lastUsing = compilationUnit.Usings.LastOrDefault();
                                            var usingDirective = SyntaxFactory.UsingDirective(SyntaxFactory.ParseName(namespaceToAdd))
                                                                          .WithTrailingTrivia(SyntaxFactory.ElasticCarriageReturnLineFeed);

                                            CompilationUnitSyntax newCompilationUnit;
                                            if (lastUsing != null)
                                            {
                                                newCompilationUnit = compilationUnit.InsertNodesAfter(lastUsing, new[] { usingDirective });
                                            }
                                            else
                                            {
                                                // 既存のusingがない場合は先頭に追加
                                                newCompilationUnit = compilationUnit.AddUsings(usingDirective);
                                            }

                                            // フォーマットを適用
                                            var formattedRoot = Formatter.Format(newCompilationUnit, workspace);

                                            // 修正範囲を設定（usingディレクティブの挿入位置）
                                            var insertionLine = lastUsing != null
                                                ? lastUsing.GetLocation().GetLineSpan().EndLinePosition.Line + 1
                                                : 0;

                                            var fix = new CodeFixResult
                                            {
                                                Title = $"using {namespaceToAdd};",
                                                Text = $"using {namespaceToAdd};\n",
                                                Range = new Api.Responses.Range
                                                {
                                                    StartLineNumber = insertionLine + 1, // Monaco Editor は1ベース
                                                    StartColumn = 1,
                                                    EndLineNumber = insertionLine + 1,
                                                    EndColumn = 1
                                                }
                                            };

                                            if (!fixes.Any(f => f.Title == fix.Title))
                                            {
                                                fixes.Add(fix);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return fixes.ToArray();
        }
        // 再帰的にすべての名前空間を取得するヘルパーメソッド
        private IEnumerable<INamespaceSymbol> GetAllNamespaces(INamespaceSymbol root)
        {
            foreach (var ns in root.GetNamespaceMembers())
            {
                yield return ns;
                foreach (var child in GetAllNamespaces(ns))
                {
                    yield return child;
                }
            }
        }
    }
}


