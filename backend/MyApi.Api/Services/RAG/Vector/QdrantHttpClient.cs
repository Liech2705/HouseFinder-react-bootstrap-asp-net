using MyApi.Api.Services.RAG.Model;

namespace MyApi.Api.Services.RAG.Vector
{
    public class QdrantHttpClient : IQdrantClient
    {
        private readonly HttpClient _http;
        private readonly AppConfig _cfg;
        private string? _activeCollection;
        public QdrantHttpClient(IHttpClientFactory f, AppConfig cfg)
        {
            _cfg = cfg;
            _http = f.CreateClient(nameof(QdrantHttpClient));
            _http.BaseAddress = new Uri(cfg.Qdrant.Endpoint.TrimEnd('/') + "/");
        }

        public async Task EnsureCollectionAsync(int vectorSize, CancellationToken ct = default)
        {
            var baseName = _cfg.Qdrant.Collection;       // ví dụ: "docs_basic"
            _activeCollection = baseName;
            var check = await _http.GetAsync($"collections/{baseName}", ct);
            if (check.IsSuccessStatusCode) return;

            var body = new
            {
                vectors = new { size = vectorSize, distance = "Cosine" }
            };
            var resp = await _http.PutAsJsonAsync($"collections/{baseName}", body, ct);
            resp.EnsureSuccessStatusCode();
        }

        public async Task UpsertAsync(IEnumerable<VecPoint> points, CancellationToken ct = default)
        {
            var name = _activeCollection ?? _cfg.Qdrant.Collection;
            var payload = new
            {
                points = points.Select(p => new {
                    id = p.Id,
                    vector = p.Vector,
                    payload = new { text = p.Text, house_Id = p.House_Id }
                })
            };
            var resp = await _http.PutAsJsonAsync($"collections/{name}/points?wait=true", payload, ct);
            resp.EnsureSuccessStatusCode();
        }

        public async Task<List<VecHit>> SearchAsync(float[] query, int topK, CancellationToken ct = default)
        {
            var name = _activeCollection ?? _cfg.Qdrant.Collection;
            var body = new
            {
                vector = query,
                limit = topK,
                with_payload = true
            };
            var resp = await _http.PostAsJsonAsync($"collections/{name}/points/search", body, ct);
            resp.EnsureSuccessStatusCode();
            var json = await resp.Content.ReadFromJsonAsync<QdrantSearchResponse>(cancellationToken: ct);

            var results = new List<VecHit>();
            foreach (var r in json.Result)
            {
                results.Add(new VecHit(r.Id, r.Score, r.Payload.Text, r.Payload.House_Id));
            }
            return results;
        }
    }
}
