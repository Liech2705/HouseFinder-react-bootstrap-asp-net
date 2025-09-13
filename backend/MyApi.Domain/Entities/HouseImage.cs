
namespace MyApi.Domain.Entities
{
    public class HouseImage
    {
        public int House_Image_Id { get; set; }
        public int House_Id { get; set; }
        public string Image_Url { get; set; } = null!;
        public DateTime Uploaded_At { get; set; }

        // Navigation
        public BoardingHouse BoardingHouse { get; set; } = null!;
    }
}
