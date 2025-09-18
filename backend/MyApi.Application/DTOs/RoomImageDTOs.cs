namespace MyApi.Application.DTOs.RoomImageDtos
{
    // DTO trả dữ liệu cho client
    public class RoomImageReadDto
    {
        public int Image_Id { get; set; }
        public int Room_Id { get; set; }
        public string? Image_Url { get; set; }
        public DateTime Uploaded_At { get; set; }
    }

    // DTO khi tạo mới ảnh phòng
    public class RoomImageCreateDto
    {
        public int Room_Id { get; set; }
        public string? Image_Url { get; set; }
    }

    // DTO khi cập nhật ảnh (chỉ đổi link ảnh)
    public class RoomImageUpdateDto
    {
        public string? Image_Url { get; set; }
    }
}
