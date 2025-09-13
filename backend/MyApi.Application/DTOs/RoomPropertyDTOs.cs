namespace MyApi.Application.DTOs.RoomPropertyDtos
{
    // DTO trả dữ liệu cho client
    public class RoomPropertyReadDto
    {
        public int PropertyId { get; set; }
        public int RoomId { get; set; }
        public bool HasAirConditioner { get; set; }
        public bool HasWifi { get; set; }
        public int BedCount { get; set; }
        public bool HasCloset { get; set; }
        public string? Note { get; set; }
        public DateTime UpdateAt { get; set; }
    }

    // DTO khi tạo mới thuộc tính phòng
    public class RoomPropertyCreateDto
    {
        public int RoomId { get; set; }
        public bool HasAirConditioner { get; set; }
        public bool HasWifi { get; set; }
        public int BedCount { get; set; }
        public bool HasCloset { get; set; }
        public string? Note { get; set; }
    }

    // DTO khi cập nhật thuộc tính phòng
    public class RoomPropertyUpdateDto
    {
        public bool HasAirConditioner { get; set; }
        public bool HasWifi { get; set; }
        public int BedCount { get; set; }
        public bool HasCloset { get; set; }
        public string? Note { get; set; }
    }
}
