namespace CodeAnalysisServer.Api.Requests
{
    public class SignatureHelpRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int Position { get; set; }
    }
}