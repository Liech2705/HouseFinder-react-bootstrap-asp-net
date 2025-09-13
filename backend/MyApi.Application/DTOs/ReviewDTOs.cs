namespace MyApi.Application.DTOs.ReviewDtos
{
    // Dùng để trả dữ liệu ra ngoài cho client
    public class ReviewReadDto
    {
        public int Review_Id { get; set; }
        public int User_Id { get; set; }
        public int Booking_Id { get; set; }
        public byte Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime Created_At { get; set; }
    }

    // Dùng khi client tạo review mới
    public class ReviewCreateDto
    {
        public int User_Id { get; set; }
        public int Booking_Id { get; set; }
        public byte Rating { get; set; }
        public string? Comment { get; set; }
    }

    // Dùng khi client muốn cập nhật review
    public class ReviewUpdateDto
    {
        public byte Rating { get; set; }
        public string? Comment { get; set; }
    }
}
