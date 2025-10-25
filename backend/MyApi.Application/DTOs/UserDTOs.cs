using MyApi.Application.DTOs.BoardingHouseDtos;
using MyApi.Application.DTOs.UserInforDtos;
using MyApi.Domain.Enums;

namespace MyApi.Application.DTOs.UserDtos
{
    // Thêm mới user (đăng ký)
    public class UserCreateDto
    {
        public string User_Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }   // nhận từ client, Hash ở service
    }

    // Cập nhật thông tin user
    public class UserUpdateDto
    {
        public string User_Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }   // optional: đổi pass
        public UserRole Role { get; set; }     // chỉ Admin mới chỉnh
    }

    // Trả về cho client
    public class UserReadDto
    {
        public int User_Id { get; set; }
        public string? User_Name { get; set; }
        public string? Email { get; set; }
        public UserRole Role { get; set; }
        public DateTime? Lock_Until { get; set; }
        public string? Reason { get; set; }
        public DateTime? Created_At { get; set; }

        // Thông tin chi tiết kèm theo (nếu cần hiển thị)
        public UserInforReadDto UserInfor { get; set; } = new UserInforReadDto();
        public ICollection<BoardingHouseReadDto> BoardingHouses { get; set; } = new List<BoardingHouseReadDto>();
    }

    public class LockedUser
    {
        public DateTime Lock_Until { get; set; }
        public string? Reason { get; set; }
    }

    public class UnlockUser
    {
        public string? Reason { get; set; }
    }
}
