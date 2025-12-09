namespace MyApi.Api.Services.RAG.Vector
{
    public record VecPoint(string Id, float[] Vector, string Text, int? House_Id);
    public record VecHit(string Id, float Score, string Text, int? House_Id);

    public interface IQdrantClient
    {
        Task EnsureCollectionAsync(int vectorSize, CancellationToken ct = default);
        Task UpsertAsync(IEnumerable<VecPoint> points, CancellationToken ct = default);
        Task<List<VecHit>> SearchAsync(float[] query, int topK, CancellationToken ct = default);
    }
    public class QdrantSearchResponse
    {
        public List<QdrantHit> Result { get; set; }
    }

    public class QdrantHit
    {
        public string Id { get; set; }
        public float Score { get; set; }
        public QdrantPayload Payload { get; set; }
    }

    public class QdrantPayload
    {
        public string Text { get; set; }
        public int House_Id { get; set; }
    }
}
