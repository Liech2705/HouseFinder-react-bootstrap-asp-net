using MyApi.Application.DTOs.ReviewDtos;
using MyApi.Application.DTOs.RoomImageDtos;
using MyApi.Application.DTOs.RoomPropertyDtos;
using MyApi.Domain.Enums;

namespace MyApi.Application.DTOs.RoomDtos
{
    // POST: thêm mới phòng
    public class RoomCreateDto
    {
        public int Owner_Id { get; set; }
        public int House_Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public RoomStatus Status { get; set; }
        public DateOnly? Check_In_Default { get; set; }
        public int? Price { get; set; }
    }

    // PUT/PATCH: cập nhật phòng
    public class RoomUpdateDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public int? Price { get; set; }
        public RoomStatus Status { get; set; }
        public DateOnly? Check_In_Default { get; set; }
    }

    // GET: trả dữ liệu cho client
    public class RoomReadDto
    {
        public int Room_Id { get; set; }
        public int Owner_Id { get; set; }
        public int House_Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? Price { get; set; }
        public RoomStatus Status { get; set; }
        public DateOnly? Check_In_Default { get; set; }
        public DateTime? Created_At { get; set; }

        // Dữ liệu quan hệ
        public string? OwnerName { get; set; }       // từ User.User_Name
        public string? HouseDescription { get; set; } // từ BoardingHouse.Description

        public ICollection<RoomImageReadDto> RoomImages { get; set; } = new List<RoomImageReadDto>();
        public ICollection<ReviewReadDto> Reviews { get; set; } = new List<ReviewReadDto>();
        public RoomPropertyReadDto RoomProperty { get; set; } = new RoomPropertyReadDto();
    }
}
