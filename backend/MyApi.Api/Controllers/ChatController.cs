using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.AspNetCore.Mvc;
using MyApi.Api.Services.RAG.Tools;
using System.Text.Json;


namespace MyApi.Api.Controllers
{
    public record ToolRagChatRequest(string Message, int? TopK, float? MinScore);

    [ApiController]
    [Route("chat")]
    public class RagChatController : ControllerBase
    {
        private readonly Client _client;
        private readonly SearchDocsTool _search;
        private readonly string _modelId;

        public RagChatController(Client client, SearchDocsTool search, IConfiguration config)
        {
            _client = client;
            _search = search;
            _modelId = config["Gemini:ChatModel"] ?? "gemini-1.5-flash";
        }

        [HttpPost("assist")]
        public async Task<IActionResult> Assist(
            [FromBody] ToolRagChatRequest req,
            CancellationToken ct
        )
        {
            // 1. Định nghĩa Tool cho Gemini
            var searchTool = new Tool
            {
                FunctionDeclarations = new List<FunctionDeclaration>
                {
                    new FunctionDeclaration
                    {
                        Name = nameof(SearchDocsTool),
                        Description = "Semantic vector search over the knowledge base. Returns relevant passages for the user's query.",
                        Parameters = new Schema
                        {
                            Type = Google.GenAI.Types.Type.OBJECT,
                            Properties = new Dictionary<string, Schema>
                            {
                                { "query", new Schema { Type = Google.GenAI.Types.Type.STRING, Description = "User question to search for" } },
                                { "topK", new Schema { Type = Google.GenAI.Types.Type.INTEGER, Description = "Number of results (1-20)" } },
                                { "minScore", new Schema { Type = Google.GenAI.Types.Type.NUMBER, Description = "Minimum similarity score (-1 to 1)" } }
                            },
                            Required = new List<string> { "query" }
                        }
                    }
                }
            };

            // 2. Cấu hình Request
            var config = new GenerateContentConfig
            {
                Tools = new List<Tool> { searchTool },
                Temperature = 0, // Để model gọi tool chính xác hơn
                SystemInstruction = new Content
                {
                    Parts = new List<Part>
                    {
                        new Part { Text = "You are a retrieval-augmented assistant. "
                                        + $"Decide when to call {nameof(SearchDocsTool)}. "
                                        + $"If the user query likely needs facts from our knowledge base, call {nameof(SearchDocsTool)} first, "
                                        + "then answer ONLY using returned snippets. "
                                        + $"If {nameof(SearchDocsTool)} returns no hits, say you don't know." }
                    }
                }
            };

            // 3. Khởi tạo lịch sử chat
            var history = new List<Content>
            {
                new Content
                {
                    Role = "user",
                    Parts = new List<Part> { new Part { Text = req.Message } }
                }
            };

            List<(int Ordinal, string Source, double Score, string House_Id)> lastHits = new();
            int maxTurns = 5; // Giới hạn số vòng lặp để tránh infinite loop
            int currentTurn = 0;

            // 4. Vòng lặp xử lý (Multi-turn Tool use)
            while (currentTurn < maxTurns)
            {
                currentTurn++;

                // Gọi Gemini API
                var response = await _client.Models.GenerateContentAsync(_modelId, history, config);

                // Lấy phần nội dung trả về đầu tiên
                var candidate = response?.Candidates?.FirstOrDefault();
                var part = candidate?.Content?.Parts?.FirstOrDefault();

                if (part == null) return BadRequest("Gemini returned empty response.");

                // TRƯỜNG HỢP 1: Model muốn gọi Function
                if (part.FunctionCall != null)
                {
                    // Lưu tin nhắn của Model vào lịch sử (để model nhớ nó vừa gọi hàm gì)
                    history.Add(candidate.Content);

                    var functionCall = part.FunctionCall;
                    string functionResultJson = "";

                    if (functionCall.Name == nameof(SearchDocsTool))
                    {
                        // Parse tham số từ Gemini (đã là Dictionary, không cần parse JSON string)
                        var args = functionCall.Args;

                        string query = args.TryGetValue("query", out var qObj) ? qObj?.ToString() ?? "" : "";

                        // Xử lý an toàn cho các kiểu số (Gemini trả về object, cần ép kiểu cẩn thận)
                        int? topK = args.TryGetValue("topK", out var tkObj) && int.TryParse(tkObj?.ToString(), out int tk) ? tk : req.TopK;
                        float? minScore = args.TryGetValue("minScore", out var msObj) && float.TryParse(msObj?.ToString(), out float ms) ? ms : req.MinScore;

                        // Gọi service search thực tế
                        functionResultJson = await _search.InvokeAsync(query, topK, minScore, ct);

                        // Parse hits để hiển thị trích dẫn sau này
                        lastHits = ParseHits(functionResultJson);
                    }
                    else
                    {
                        functionResultJson = $"Error: Unknown tool {functionCall.Name}";
                    }

                    // Tạo message phản hồi Function (Role = "function")
                    var functionResponsePart = new Part
                    {
                        FunctionResponse = new FunctionResponse
                        {
                            Name = functionCall.Name,
                            Response = new Dictionary<string, object>
                            {
                                { "result", functionResultJson }
                            } // Gemini mong đợi một object JSON
                        }
                    };

                    history.Add(new Content
                    {
                        Role = "function",
                        Parts = new List<Part> { functionResponsePart }
                    });

                    // Tiếp tục vòng lặp để Model sinh câu trả lời cuối cùng dựa trên kết quả này
                    continue;
                }

                // TRƯỜNG HỢP 2: Model trả về Text (hoàn tất)
                if (!string.IsNullOrEmpty(part.Text))
                {
                    var reply = part.Text;
                    reply += BuildCitations(lastHits);
                    var houseIds = lastHits
                            .Select(h => h.House_Id)
                            .Where(id => !string.IsNullOrEmpty(id))
                            .Distinct()
                            .ToList();
                    return Ok(new { reply, houseIds = houseIds });
                }

                break; // Should not reach here
            }

            return BadRequest("Max turns exceeded or unexpected flow.");
        }

        // --- Các hàm Helper giữ nguyên logic nhưng chỉnh lại một chút nếu cần ---

        private static List<(int Ordinal, string Source, double Score, string House_Id)> ParseHits(string resultJson)
        {
            var hits = new List<(int, string, double, string)>();
            try
            {
                using var resultDoc = JsonDocument.Parse(resultJson);
                // Vì service của bạn trả về JSON string, ta cần parse nó
                // Lưu ý: Đảm bảo cấu trúc JSON của _search.InvokeAsync khớp với code này
                if (resultDoc.RootElement.ValueKind == JsonValueKind.Object && resultDoc.RootElement.TryGetProperty("hits", out var hitsProp))
                {
                    foreach (var h in hitsProp.EnumerateArray())
                    {
                        string rawId = h.TryGetProperty("id", out var idProp) ? idProp.GetString() ?? "" : "";
                        hits.Add((
                           h.GetProperty("ordinal").GetInt32(),
                           h.GetProperty("source").GetString() ?? "(unknown)",
                           h.GetProperty("score").GetDouble(),
                           rawId
                        ));
                    }
                }
            }
            catch { /* Log error here */ }
            return hits;
        }

        private static string BuildCitations(List<(int Ordinal, string Source, double Score, string House_Id)> hits)
        {
            if (hits.Count == 0) return string.Empty;
            return "\n\nSources:\n" + string.Join("\n", hits.Select(h => $"[#${h.Ordinal}] {h.Source} (score={h.Score:0.000}) (house_Id={h.House_Id})"));
        }
    }
}
