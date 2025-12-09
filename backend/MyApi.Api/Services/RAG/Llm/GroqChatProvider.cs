using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using MyApi.Api.Services.RAG.Llm;

public class GroqChatProvider : ILlmChatProvider
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _model;

    public GroqChatProvider(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey = config["Groq:ApiKey"]
            ?? throw new Exception("Missing Groq:ApiKey");

        // mặc định dùng LLaMA 3.1 70B
        _model = config["Groq:ChatModel"] ?? "llama-3.1-70b-versatile";

        _http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _apiKey);
    }

    public async Task<string> AskAsync(string system, string user, CancellationToken ct = default)
    {
        int maxSystemLength = 12000;

        if (!string.IsNullOrEmpty(system) && system.Length > maxSystemLength)
        {
            // Cắt bớt và thêm cảnh báo
            system = system.Substring(0, maxSystemLength) + "\n... [Dữ liệu quá dài, đã bị cắt bớt]";
        }
        var reqBody = new
        {
            model = _model,
            messages = new[]
            {
                new { role = "system", content = system },
                new { role = "user", content = user }
            }
        };

        var json = JsonSerializer.Serialize(reqBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var resp = await _http.PostAsync(
            "https://api.groq.com/openai/v1/chat/completions",
            content,
            ct
        );

        var respText = await resp.Content.ReadAsStringAsync(ct);

        if (!resp.IsSuccessStatusCode)
            throw new Exception($"Groq error: {resp.StatusCode} => {respText}");

        var doc = JsonDocument.Parse(respText);
        return doc.RootElement
                  .GetProperty("choices")[0]
                  .GetProperty("message")
                  .GetProperty("content")
                  .GetString()
                  ?? "";
    }
}
