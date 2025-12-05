using MyApi.Domain.Enums;

namespace MyApi.Domain.Entities
{
    public class Room
    {
        public int Room_Id { get; set; }
        public int Owner_Id { get; set; }
        public int House_Id { get; set; }
        public string Title { get; set; }

        public string? Description { get; set; }

        public int? Price { get; set; }
        public RoomStatus Status { get; set; } = RoomStatus.visible;
        public DateOnly? Check_In_Default { get; set; }
        public DateTime? Created_At { get; set; }

        // Navigation
        public User Owner { get; set; }
        public BoardingHouse BoardingHouse { get; set; }
        public ICollection<RoomImage> RoomImages { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<ChatConversation> ChatConversations { get; set; }
        public RoomProperty RoomProperty { get; set; }
        public ICollection<FavoriteHouse> FavoriteHouse { get; set; } 
    }
}
