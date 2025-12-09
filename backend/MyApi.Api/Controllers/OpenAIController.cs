using Microsoft.AspNetCore.Mvc;
using MyApi.Api.Services.RAG.Tools;
using OpenAI.Chat;
using System.Text.Json;

namespace MyApi.Api.Controllers
{
    [ApiController]
    [Route("chat/OpenAI")]
    public class OpenAIChatController : ControllerBase
    {
        private readonly ChatClient _chat;
        private readonly SearchDocsTool _search;

        public OpenAIChatController(ChatClient chat, SearchDocsTool search)
        {
            _chat = chat;
            _search = search;
        }

        [HttpPost("assist")]
        public async Task<IActionResult> Assist(
            [FromBody] ToolRagChatRequest req,
            CancellationToken ct
        )
        {
            var searchTool = ChatTool.CreateFunctionTool(
                functionName: nameof(SearchDocsTool),
                functionDescription: "Semantic vector search over the knowledge base. Returns relevant passages for the user's query.",
                functionParameters: BinaryData.FromBytes(
                    """
                    {
                      "type":"object",
                      "properties":{
                        "query":{"type":"string","description":"User question to search for"},
                        "topK":{"type":"integer","minimum":1,"maximum":20},
                        "minScore":{"type":"number","minimum":-1,"maximum":1}
                      },
                      "required":["query"],
                      "additionalProperties": false
                    }
                    """u8.ToArray()
                )
            );

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(
                    "You are a retrieval-augmented assistant. "
                        + $"Decide when to call {nameof(SearchDocsTool)}. "
                        + $"If the user query likely needs facts from our knowledge base, call {nameof(SearchDocsTool)} first, "
                        + "then answer ONLY using returned snippets. "
                        + $"If {nameof(SearchDocsTool)} returns no hits, say you don't know."
                ),
                new UserChatMessage(req.Message),
            };

            var options = new ChatCompletionOptions { Tools = { searchTool } };

            // 1. Sửa Tuple để lưu thêm HouseId (int)
            List<(double Score, int House_Id)> lastHits = new();

            bool requiresAction;
            do
            {
                requiresAction = false;
                var completionResult = await _chat.CompleteChatAsync(messages, options, ct);
                var completion = completionResult.Value ?? completionResult;
                if (completion == null)
                    return BadRequest("No completion result.");

                switch (completion.FinishReason)
                {
                    case ChatFinishReason.Stop:
                        messages.Add(new AssistantChatMessage(completion));
                        var reply =
                            completion.Content != null && completion.Content.Count > 0
                                ? completion.Content[0].Text
                                : string.Empty;

                        reply += BuildCitations(lastHits);

                        // 2. Trích xuất danh sách HouseId để trả về Client
                        var houseIds = lastHits
                            .Select(h => h.House_Id)
                            .Where(id => id > 0)
                            .Distinct()         
                            .ToList();

                        // Trả về cả reply text và danh sách houseIds
                        return Ok(new { reply, houseIds });

                    case ChatFinishReason.ToolCalls:
                        messages.Add(new AssistantChatMessage(completion));
                        if (completion.ToolCalls != null)
                        {
                            foreach (var call in completion.ToolCalls)
                                await HandleToolCall(call, req, messages, ct, lastHits);
                        }
                        requiresAction = true;
                        break;
                    default:
                        throw new NotImplementedException(completion.FinishReason.ToString());
                }
            } while (requiresAction);

            return BadRequest("Unexpected exit from chat loop.");
        }

        // 3. Cập nhật hàm ParseHits để lấy field house_Id từ JSON
        private static List<(double Score, int HouseId)> ParseHits(string resultJson)
        {
            var hits = new List<(double, int)>(); // Thêm int ở đây
            try
            {
                using var resultDoc = JsonDocument.Parse(resultJson);
                hits = resultDoc
                    .RootElement.GetProperty("hits") // Tool của bạn trả về object có property "hits"
                    .EnumerateArray()
                    .Select(h =>
                        (
                            Score: h.TryGetProperty("score", out var sc) ? sc.GetDouble() : 0,
                            HouseId: h.TryGetProperty("house_id", out var hid) ? hid.GetInt32() : -1
                        )
                    )
                    .ToList();
            }
            catch
            {
                /* ignore parse errors */
            }
            return hits;
        }

        private static string BuildCitations(List<(double Score, int HouseId)> hits)
        {
            if (hits.Count == 0)
                return string.Empty;

            // Có thể hiển thị thêm ID vào citation nếu muốn debug, ở đây mình giữ nguyên format cũ
            return "\n\nSources:\n"
                + string.Join(
                    "\n",
                    hits.Select(h => $"[#{h.HouseId}](score={h.Score:0.000})")
                );
        }

        private async Task HandleToolCall(
            ChatToolCall call,
            ToolRagChatRequest req,
            List<ChatMessage> messages,
            CancellationToken ct,
            List<( double Score, int HouseId)> lastHits
        )
        {
            switch (call.FunctionName)
            {
                case nameof(SearchDocsTool):
                    string argJson = call.FunctionArguments.ToString();
                    using (var doc = JsonDocument.Parse(argJson))
                    {
                        var root = doc.RootElement;
                        string query = root.TryGetProperty("query", out var q)
                            ? q.GetString() ?? ""
                            : "";
                        int? topK = root.TryGetProperty("topK", out var tk)
                            ? tk.GetInt32()
                            : req.TopK;
                        float? minScore = root.TryGetProperty("minScore", out var ms)
                            ? (float?)ms.GetDouble()
                            : req.MinScore;

                        string resultJson = await _search.InvokeAsync(query, topK, minScore, ct);

                        lastHits.Clear();
                        lastHits.AddRange(ParseHits(resultJson)); // Parse JSON và lưu HouseId vào lastHits

                        messages.Add(
                            new ToolChatMessage(
                                call.Id,
                                [ChatMessageContentPart.CreateTextPart(resultJson)]
                            )
                        );
                    }
                    break;
                default:
                    messages.Add(
                        new ToolChatMessage(
                            call.Id,
                            [
                                ChatMessageContentPart.CreateTextPart(
                                    $"Unknown tool: {call.FunctionName}"
                                ),
                            ]
                        )
                    );
                    break;
            }
        }
    }
}