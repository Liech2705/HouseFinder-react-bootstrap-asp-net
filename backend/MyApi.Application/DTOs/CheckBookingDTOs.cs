namespace MyApi.Application.DTOs.CheckBookingDtos
{
    // Dùng để trả dữ liệu về cho client
    public class CheckBookingReadDto
    {
        public int Check_Id { get; set; }
        public int Booking_Id { get; set; }
        public string Image_Url { get; set; } = null!;
        public string? Check { get; set; }   // Trả enum dưới dạng string cho dễ đọc
        public DateTime Check_Date { get; set; }
    }

    // Dùng khi client gửi request tạo mới
    public class CheckBookingCreateDto
    {
        public int Booking_Id { get; set; }
        public string Image_Url { get; set; } = null!;
        public int Check { get; set; }      // Enum truyền dưới dạng int
        public DateTime Check_Date { get; set; }
    }

    // Dùng khi client muốn update bản ghi
    public class CheckBookingUpdateDto
    {
        public string Image_Url { get; set; } = null!;
        public int Check { get; set; }
        public DateTime Check_Date { get; set; }
    }
}
