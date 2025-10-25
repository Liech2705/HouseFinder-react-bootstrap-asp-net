
namespace MyApi.Domain.Entities
{
    public class FavoriteHouse
    {
        public int Favorite_Id { get; set; }
        public int User_Id { get; set; }
        public int House_Id { get; set; }
        public int? Room_Id { get; set; }
        public bool IsFavorite { get; set; } = true; // nếu user bỏ thích thì set false

        public DateTime Created_At { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User User { get; set; }
        public BoardingHouse BoardingHouse { get; set; }
        public Room? Room { get; set; }
    }
}
