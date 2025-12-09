//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Text.Json;

//namespace MyApi.Api.Services.RAG.Embedding
//{
//    public class GroqEmbeddingProvider : IEmbeddingProvider
//    {
//        private readonly HttpClient _http;
//        private readonly string _apiKey;
//        private readonly string _model;
//        private int? _dim;

//        public GroqEmbeddingProvider(HttpClient http, IConfiguration config)
//        {
//            _http = http;
//            _apiKey = config["Groq:ApiKey"]
//                ?? throw new Exception("Missing Groq:ApiKey");

//            // Default dùng LLaMA-3 8B Embedding (2560 chiều)
//            _model = config["Groq:EmbedModel"] ?? "llama-3.1-8b-embedding";

//            _http.DefaultRequestHeaders.Authorization =
//                new AuthenticationHeaderValue("Bearer", _apiKey);
//        }

//        public async Task<float[]> EmbedAsync(string text, CancellationToken ct = default)
//        {
//            var body = new
//            {
//                model = _model,
//                input = text
//            };

//            var json = JsonSerializer.Serialize(body);
//            var content = new StringContent(json, Encoding.UTF8, "application/json");

//            HttpResponseMessage resp;
//            try
//            {
//                resp = await _http.PostAsync(
//                    "https://api.groq.com/openai/v1/embeddings",
//                    content,
//                    ct
//                );
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Groq Embed Error: {ex.Message}");
//                return Array.Empty<float>();
//            }

//            var respText = await resp.Content.ReadAsStringAsync(ct);

//            if (!resp.IsSuccessStatusCode)
//            {
//                Console.WriteLine($"Groq Embed Error: {resp.StatusCode} => {respText}");
//                return Array.Empty<float>();
//            }

//            var doc = JsonDocument.Parse(respText);
//            var values = doc.RootElement
//                            .GetProperty("data")[0]
//                            .GetProperty("embedding")
//                            .EnumerateArray()
//                            .Select(v => (float)v.GetDouble())
//                            .ToArray();

//            if (!_dim.HasValue)
//                _dim = values.Length;

//            return values;
//        }

//        public async Task<int> GetDimAsync(CancellationToken ct = default)
//        {
//            if (_dim.HasValue) return _dim.Value;

//            var test = await EmbedAsync("dimension probe", ct);

//            // default dim nếu lỗi — llama3.1-8b-embedding = 2560
//            _dim = test.Length > 0 ? test.Length : 2560;

//            return _dim.Value;
//        }
//    }
//}
