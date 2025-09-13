
namespace MyApi.Domain.Entities
{
    public class RoomImage
    {
        public int Image_Id { get; set; }
        public int Room_Id { get; set; }
        public string Image_Url { get; set; } = null!;
        public DateTime Uploaded_At { get; set; }

        // Navigation
        public Room Room { get; set; } = null!;
    }
}
