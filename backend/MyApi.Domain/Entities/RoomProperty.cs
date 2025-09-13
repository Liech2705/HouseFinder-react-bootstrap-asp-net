
namespace MyApi.Domain.Entities
{
    public class RoomProperty
    {
        public int PropertyId { get; set; }
        public int RoomId { get; set; }
        public bool HasAirConditioner { get; set; }
        public bool HasWifi { get; set; }
        public int BedCount { get; set; }
        public bool HasCloset { get; set; }
        public string? Note { get; set; }
        public DateTime UpdateAt { get; set; }

        // Navigation
        public Room Room { get; set; } = null!;
    }
}
