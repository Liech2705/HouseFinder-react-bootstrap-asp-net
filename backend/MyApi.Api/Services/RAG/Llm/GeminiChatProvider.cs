using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.Extensions.Configuration;
using MyApi.Api.Services.RAG.Llm;

namespace RagAppBasic.Services.Llm;

public class GeminiChatProvider : ILlmChatProvider
{
    private readonly Client _client;
    private readonly string _modelId;

    // Inject Client đã được cấu hình từ DI container
    public GeminiChatProvider(Client client, IConfiguration config)
    {
        _client = client;
        // Mặc định dùng gemini-1.5-flash nếu không cấu hình
        _modelId = config["Gemini:ChatModel"] ?? "gemini-1.5-flash";
    }

    public async Task<string> AskAsync(string system, string user, CancellationToken ct = default)
    {
        // 1. Cấu hình System Instruction (Lời nhắc hệ thống)
        var config = new GenerateContentConfig
        {
            SystemInstruction = new Content
            {
                Parts = new List<Part> { new Part { Text = system } }
            }
        };

        // 2. Tạo nội dung User message
        // Gemini SDK mới hỗ trợ truyền string trực tiếp cho trường hợp đơn giản,
        // nhưng để chuẩn chỉnh ta dùng object Content.
        var contents = new List<Content>
        {
            new Content
            {
                Role = "user",
                Parts = new List<Part> { new Part { Text = user } }
            }
        };

        // 3. Gọi API
        // Lưu ý: SDK Google.GenAI trả về response có thuộc tính Text trực tiếp
        var response = await _client.Models.GenerateContentAsync(
            model: _modelId,
            contents: contents,
            config: config
        // CancellationToken chưa được hỗ trợ trực tiếp trong mọi version của SDK này, 
        // nếu lỗi biên dịch hãy bỏ tham số ct hoặc dùng Task.Run wrapper.
        );

        return response.ToString();
    }
}