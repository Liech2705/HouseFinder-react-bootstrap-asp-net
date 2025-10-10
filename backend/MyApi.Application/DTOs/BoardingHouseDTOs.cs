using MyApi.Application.DTOs.HouseImageDtos;
using MyApi.Application.DTOs.RoomDtos;
using MyApi.Domain.Enums;
namespace MyApi.Application.DTOs.BoardingHouseDtos
{
    // Dùng cho POST (thêm mới)
    public class BoardingHouseCreateDto
    {
        public int User_Id { get; set; }
        public string House_Name { get; set; }

        public string Description { get; set; }

        public bool? Is_Elevator { get; set; }
        public int Electric_Cost { get; set; }
        public int Water_Cost { get; set; }
        public string Province { get; set; }
        public string Commune { get; set; }
        public string Street { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Note { get; set; }

    }

    // Dùng cho PUT/PATCH (cập nhật)
    public class BoardingHouseUpdateDto
    {
        public string House_Name { get; set; }
        public string? Description { get; set; }
        public bool? Is_Elevator { get; set; }
        public int Electric_Cost { get; set; }
        public int Water_Cost { get; set; }
        public string Province { get; set; }
        public string Commune { get; set; }
        public string Street { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Note { get; set; }
        public HouseStatus Status { get; set; }
    }

    // Dùng cho GET (trả dữ liệu về client)
    public class BoardingHouseReadDto
    {
        public int House_Id { get; set; }   // Giữ cả get;set; để AutoMapper map
        public int User_Id { get; set; }
        public string House_Name { get; set; }
        public string? Description { get; set; }
        public bool? Is_Elevator { get; set; }
        public int Electric_Cost { get; set; }
        public int Water_Cost { get; set; }
        public string Province { get; set; }
        public string Commune { get; set; }
        public string Street { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Note { get; set; }
        public HouseStatus Status { get; set; }
        public DateTime? Create_At { get; set; }

        // Thông tin liên quan (nếu muốn hiển thị luôn)
        public string? UserName { get; set; }   // lấy từ User.FullName hoặc Email
        public ICollection<RoomReadDto> Rooms { get; set; } = new List<RoomReadDto>();
        public ICollection<HouseImageReadDto> HouseImages { get; set; } = new List<HouseImageReadDto>();
    }
}
