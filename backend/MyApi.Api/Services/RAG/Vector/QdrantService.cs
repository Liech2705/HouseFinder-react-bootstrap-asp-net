//using Qdrant.Client;
//using Qdrant.Client.Grpc; // 👈 QUAN TRỌNG: Namespace chứa VectorParams, PointStruct, Distance...
//using System.Collections.Generic;

//namespace MyApi.Api.Services.RAG.Vector
//{
//    public class QdrantService
//    {
//        private readonly QdrantClient _client;
//        private readonly string _collection;

//        public QdrantService(IConfiguration config)
//        {
//            // 1. Cho phép HTTP/2 không bảo mật (nếu chạy http://localhost)
//            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
//            var host = config["Qdrant:Host"] ?? "localhost";
//            var port = int.Parse(config["Qdrant:Port"] ?? "6334");
//            _collection = config["Qdrant:CollectionName"] ?? "room_docs";

//            // Khởi tạo Client (Nên tách host và port)
//            _client = new QdrantClient(host, port);
//        }

//        public async Task CreateCollectionIfNotExistsAsync(ulong vectorSize = 768, CancellationToken ct = default)
//        {
//            // 1. Kiểm tra collection tồn tại chưa
//            var collections = await _client.ListCollectionsAsync(ct);
//            if (collections.Contains(_collection))
//            {
//                return;
//            }

//            // 2. Tạo mới nếu chưa có
//            // Hàm CreateCollectionAsync bản mới nhận trực tiếp VectorParams
//            await _client.CreateCollectionAsync(_collection, new VectorParams
//            {
//                Size = vectorSize,
//                Distance = Distance.Cosine
//            }, cancellationToken: ct);
//        }

//        public async Task UpsertAsync(IEnumerable<VecPoint> points, CancellationToken ct = default)
//        {
//            // 3. Tạo PointStruct chuẩn gRPC
//            var point = new PointStruct
//            {
//                // ID phải bọc trong PointId (Uuid hoặc Num)
//                Id = new PointId { Uuid = id.ToString() },

//                // Vector phải bọc trong Vectors -> Vector -> Data
//                Vectors = new Vectors { Vector = new Qdrant.Client.Grpc.Vector { Data = { vector } } },

//                // Payload phải convert sang Value của Qdrant
//                Payload = {
//                    ["text"] = new Value { StringValue = payloadText }
//                }
//            };

//            await _client.UpsertAsync(_collection, new[] { point }, cancellationToken: ct);
//        }

//        public async Task<List<(string text, float score)>> SearchAsync(float[] queryVector, ulong topK = 5, CancellationToken ct = default)
//        {
//            // 4. Tìm kiếm
//            var searchResult = await _client.SearchAsync(
//                collectionName: _collection,
//                vector: queryVector,
//                limit: topK,
//                cancellationToken: ct
//            );

//            var res = new List<(string, float)>();

//            foreach (var r in searchResult)
//            {
//                // Lấy payload an toàn (Check null và kiểu dữ liệu)
//                string text = "";
//                if (r.Payload.TryGetValue("text", out var val) && val.KindCase == Value.KindOneofCase.StringValue)
//                {
//                    text = val.StringValue;
//                }

//                res.Add((text, r.Score));
//            }

//            return res;
//        }
//    }
//}