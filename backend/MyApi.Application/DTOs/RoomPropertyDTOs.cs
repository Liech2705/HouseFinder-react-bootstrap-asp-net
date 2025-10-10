namespace MyApi.Application.DTOs.RoomPropertyDtos
{
    // DTO trả dữ liệu cho client
    public class RoomPropertyReadDto
    {
        public int Property_Id { get; set; }
        public int Room_Id { get; set; }
        public bool Has_AirConditioner { get; set; }
        public bool Has_Wifi { get; set; }
        public int Bed_Count { get; set; }
        public bool Has_Closet { get; set; }
        public bool Has_Mezzanine { get; set; }
        public bool Has_Fridge { get; set; }
        public bool Has_Hot_Water { get; set; }
        public bool Has_Window { get; set; }
        public bool Has_Pet { get; set; }
        public string? Note { get; set; }
        public DateTime Update_At { get; set; }
    }

    // DTO khi tạo mới thuộc tính phòng
    public class RoomPropertyCreateDto
    {
        public int Room_Id { get; set; }
        public bool Has_AirConditioner { get; set; }
        public bool Has_Wifi { get; set; }
        public int Bed_Count { get; set; }
        public bool Has_Closet { get; set; }
        public bool Has_Mezzanine { get; set; }
        public bool Has_Fridge { get; set; }
        public bool Has_Hot_Water { get; set; }
        public bool Has_Window { get; set; }
        public bool Has_Pet { get; set; }
        public string? Note { get; set; }
    }

    // DTO khi cập nhật thuộc tính phòng
    public class RoomPropertyUpdateDto
    {
        public bool Has_AirConditioner { get; set; }
        public bool Has_Wifi { get; set; }
        public int Bed_Count { get; set; }
        public bool Has_Closet { get; set; }
        public bool Has_Mezzanine { get; set; }
        public bool Has_Fridge { get; set; }
        public bool Has_Hot_Water { get; set; }
        public bool Has_Window { get; set; }
        public bool Has_Pet { get; set; }
        public string? Note { get; set; }
    }
}
