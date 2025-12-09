using Google.GenAI;
using Google.GenAI.Types;


namespace MyApi.Api.Services.RAG.Embedding
{
    public class GeminiEmbeddingProvider : IEmbeddingProvider
    {
        private readonly Client _client;
        private readonly string _modelId;
        private int? _dim;

        public GeminiEmbeddingProvider(Client client, IConfiguration config)
        {
            _client = client;
            _modelId = config["Gemini:EmbedModel"] ?? "text-embedding-004";
        }

        public async Task<float[]> EmbedAsync(string text, CancellationToken ct = default)
        {
            var contentList = new List<Content>
            {
                new Content { Parts = new List<Part> { new Part { Text = text } } }
            };

            try
            {
                var response = await _client.Models.EmbedContentAsync(_modelId, contentList);
                var firstEmbedding = response?.Embeddings?.FirstOrDefault();

                if (firstEmbedding?.Values == null)
                {
                    return Array.Empty<float>();
                }

                // SỬA LỖI TẠI ĐÂY:
                // Dữ liệu gốc là double (IEnumerable<double>), cần ép kiểu sang float
                var vec = firstEmbedding.Values
                            .Select(d => (float)d) // Chuyển từng số double thành float
                            .ToArray();

                if (!_dim.HasValue)
                {
                    _dim = vec.Length;
                }

                return vec;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Gemini Embed Error: {ex.Message}");
                return Array.Empty<float>();
            }
        }

        public async Task<int> GetDimAsync(CancellationToken ct = default)
        {
            if (_dim.HasValue) return _dim.Value;

            var vector = await EmbedAsync("dimension probe", ct);

            // Nếu gọi lỗi trả về mảng rỗng, ta gán tạm giá trị mặc định (768 cho text-embedding-004)
            // để tránh crash ứng dụng khi khởi tạo
            _dim = vector.Length > 0 ? vector.Length : 768;

            return _dim.Value;
        }
    }
}