namespace MyApi.Application.DTOs.HouseImageDtos
{
    // Dùng để trả dữ liệu ra ngoài cho client
    public class HouseImageReadDto
    {
        public int House_Image_Id { get; set; }
        public int House_Id { get; set; }
        public string Image_Url { get; set; } = null!;
        public DateTime Uploaded_At { get; set; }
    }

    // Dùng khi client gửi dữ liệu để tạo mới
    public class HouseImageCreateDto
    {
        public int House_Id { get; set; }
        public string Image_Url { get; set; } = null!;
    }

    // Dùng khi client muốn update bản ghi
    public class HouseImageUpdateDto
    {
        public string Image_Url { get; set; } = null!;
    }
}
