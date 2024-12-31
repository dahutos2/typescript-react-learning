namespace CodeAnalysisServer.Api.Responses
{
    public class CompletionResult
    {
        public string Label { get; set; } = string.Empty;
        public string Kind { get; set; } = string.Empty;
        public string InsertText { get; set; } = string.Empty;
        public string Detail { get; set; } = string.Empty;
    }
}
