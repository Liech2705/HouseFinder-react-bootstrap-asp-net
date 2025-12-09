using Microsoft.EntityFrameworkCore;
using MyApi.Api.Services.RAG.Embedding;
using MyApi.Api.Services.RAG.Vector;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Infrastructure.Data;

namespace MyApi.Api.Services.RAG.Index
{
    public class HouseIndexer
    {
        private readonly AppDbContext _db;
        private readonly IEmbeddingProvider _embed;
        private readonly IQdrantClient _qdrant;

        public HouseIndexer(AppDbContext db, IEmbeddingProvider embed, IQdrantClient qdrant, AppDbContext context)
        {
            _db = db; _embed = embed; _qdrant = qdrant;
        }

        public async Task IndexAllAsync(CancellationToken ct = default)
        {
            var docs = await BuildDocuments(ct);

            // create collection with correct size if not exists.
            if (docs.Count > 0)
            {
                var sampleVec = await _embed.EmbedAsync(docs[0].Text, ct);
                await _qdrant.EnsureCollectionAsync(sampleVec.Length, ct);
            }
            else
            {
                await _qdrant.EnsureCollectionAsync(768, ct); // fallback
            }
            var list = new List<VecPoint>();
            foreach (var d in docs)
            {
                var v = await _embed.EmbedAsync(d.Text, ct);
                string text = d.Text;
                int house_Id = d.House_Id;
                list.Add(new VecPoint(Guid.NewGuid().ToString("N"), v, text, house_Id));
            }
            await _qdrant.UpsertAsync(list, ct);
        }

        public async Task<List<RagDocument>> BuildDocuments(CancellationToken ct = default)
        {
            var houses = await _db.BoardingHouses
                .Include(h => h.Rooms)
                    .ThenInclude(r => r.Reviews)
                .Include(h => h.Rooms)
                    .ThenInclude(r => r.RoomProperty)
                .Include(h => h.Rooms)
                    .ThenInclude(r => r.Bookings)
                .ToListAsync(ct);

            var docs = new List<RagDocument>();

            foreach (var h in houses)
            {
                // Calculate price range
                var visibleRooms = h.Rooms.Where(r => r.Status == RoomStatus.visible).ToList();
                var minPrice = visibleRooms.Any() ? visibleRooms.Min(r => (decimal?)r.Price) : 0;
                var maxPrice = visibleRooms.Any() ? visibleRooms.Max(r => (decimal?)r.Price) : 0;

                // Count rooms
                int countRoom = h.Rooms.Count;
                int noneAvailable = h.Rooms.Count(r => !_db.Bookings.Any(b => b.Room_Id == r.Room_Id));

                // Aggregate room properties (e.g., "Air Conditioner", "Wifi")
                // We check if *any* room has these features to list them for the house
                var features = new List<string>();
                if (h.Is_Elevator == true) features.Add("Thang máy");

                // Check properties across all rooms to see what's generally available
                bool hasAC = h.Rooms.Any(r => r.RoomProperty?.Has_AirConditioner == true);
                bool hasWifi = h.Rooms.Any(r => r.RoomProperty?.Has_Wifi == true);
                bool hasCloset = h.Rooms.Any(r => r.RoomProperty?.Has_Closet == true);
                bool hasMezzanine = h.Rooms.Any(r => r.RoomProperty?.Has_Mezzanine == true);
                bool hasFridge = h.Rooms.Any(r => r.RoomProperty?.Has_Fridge == true);
                bool hasHotWater = h.Rooms.Any(r => r.RoomProperty?.Has_Hot_Water == true);
                bool hasWindow = h.Rooms.Any(r => r.RoomProperty?.Has_Window == true);
                bool hasPet = h.Rooms.Any(r => r.RoomProperty?.Has_Pet == true);

                if (hasAC) features.Add("Máy lạnh/Điều hòa");
                if (hasWifi) features.Add("Wifi miễn phí");
                if (hasCloset) features.Add("Tủ quần áo");
                if (hasMezzanine) features.Add("Gác lửng");
                if (hasFridge) features.Add("Tủ lạnh");
                if (hasHotWater) features.Add("Nước nóng");
                if (hasWindow) features.Add("Cửa sổ thoáng mát");
                if (hasPet) features.Add("Cho phép nuôi thú cưng");

                string featureText = features.Any() ? string.Join(", ", features) : "Cơ bản";

                // Aggregate reviews (average rating and some comments)
                var allReviews = h.Rooms.SelectMany(r => r.Reviews).ToList();
                double avgRating = allReviews.Any() ? allReviews.Average(r => r.Rating) : 0;
                int reviewCount = allReviews.Count;

                // Take a few recent comments to add context (optional, limits token usage)
                var recentComments = allReviews
                    .OrderByDescending(r => r.Created_At)
                    .Take(3)
                    .Where(r => !string.IsNullOrWhiteSpace(r.Comment))
                    .Select(r => $"\"{r.Comment}\"")
                    .ToList();

                string reviewText = reviewCount > 0
                    ? $"{avgRating:F1}/5 sao ({reviewCount} đánh giá)"
                    : "Chưa có đánh giá";

                string commentsText = recentComments.Any()
                    ? $"Nhận xét gần đây: {string.Join("; ", recentComments)}"
                    : "";

                // Construct the full text document
                var text = $@"Nhà trọ: {h.House_Name}
                            Địa chỉ: {h.Street}, {h.Commune}, {h.Province}
                            Giá thuê: {minPrice:N0} - {maxPrice:N0} VND
                            Chi phí khác: Điện {h.Electric_Cost:N0}/kwh, Nước {h.Water_Cost:N0}/khối
                            Tổng quan: {countRoom} phòng, còn trống {noneAvailable} phòng.
                            Tiện ích nổi bật: {featureText}
                            Đánh giá: {reviewText}. {commentsText}
                            Mô tả chi tiết: {h.Description}";

                docs.Add(new RagDocument { Text = text.Trim(), House_Id = h.House_Id });
            }
            return docs;
        }
    }
}
