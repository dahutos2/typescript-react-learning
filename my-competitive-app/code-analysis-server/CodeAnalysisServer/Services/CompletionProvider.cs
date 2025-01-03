using CodeAnalysisServer.Api.Interfaces;
using CodeAnalysisServer.Api.Requests;
using CodeAnalysisServer.Api.Responses;
using CodeAnalysisServer.Workspaces;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Completion;
using Microsoft.Extensions.Caching.Memory;

namespace CodeAnalysisServer.Services
{
    public class CompletionProvider : ICompletionProvider
    {
        private readonly IAssemblyProvider _assemblyProvider;
        private readonly IMemoryCache _cache;

        public CompletionProvider(IAssemblyProvider assemblyProvider, IMemoryCache cache)
        {
            _assemblyProvider = assemblyProvider;
            _cache = cache;
        }

        public async Task<CompletionResult[]> ProvideCompletionAsync(CompletionRequest request)
        {
            var cacheKey = $"{request.UserId}_{request.Code}_{request.CursorPosition}_completion";
            if (_cache.TryGetValue(cacheKey, out CompletionResult[]? cachedCompletions))
            {
                return cachedCompletions ?? [];
            }

            // Workspace & Document 作成
            var workspace = new CompletionWorkspace(_assemblyProvider);
            var document = await workspace.CreateDocumentAsync(request.Code);
            if (document == null) return [];

            var completionService = CompletionService.GetService(document);
            if (completionService == null) return [];
            var completions = await completionService.GetCompletionsAsync(document, request.CursorPosition);
            if (completions == null) return [];

            var semanticModel = await document.GetSemanticModelAsync();
            var syntaxRoot = await document.GetSyntaxRootAsync();
            if (semanticModel == null || syntaxRoot == null) return [];

            var resultsList = new List<CompletionResult>();

            foreach (var item in completions.ItemsList)
            {
                var detailText = await completionService.GetDescriptionAsync(document, item, CancellationToken.None);

                resultsList.Add(new CompletionResult
                {
                    Label = item.DisplayText,
                    Kind = item.Tags.FirstOrDefault() ?? "Text",
                    InsertText = item.DisplayText,
                    Detail = detailText?.Text ?? string.Empty,
                });
            }

            var results = resultsList.ToArray();
            _cache.Set(cacheKey, results, TimeSpan.FromMinutes(5));

            return results;
        }
    }
}
