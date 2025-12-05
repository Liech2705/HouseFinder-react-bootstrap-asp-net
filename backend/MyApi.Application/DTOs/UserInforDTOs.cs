using Microsoft.AspNetCore.Http;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using System.Text.Json.Serialization;

namespace MyApi.Application.DTOs.UserInforDtos
{
    // Dùng cho POST (thêm mới thông tin user)
    public class UserInforCreateDto
    {
        public int User_Id { get; set; }      // liên kết với User
        public DateOnly? Dob { get; set; }
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        public InforGender? Gender { get; set; }
        public string? Address { get; set; }
    }

    // Dùng cho PUT/PATCH (cập nhật thông tin user)
    public class UserInforUpdateDto
    {
        public int Infor_Id { get; set; }
        public DateOnly Dob { get; set; }
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        public string userName { get; set; }
        public InforGender? Gender { get; set; }
        public string? Address { get; set; }
        public DateTime Update_At { get; set; }

        public IFormFile? AvatarFile { get; set; }
    }

    // Dùng cho GET (trả dữ liệu về client)
    public class UserInforReadDto
    {
        public int Infor_Id { get; set; }
        public int User_Id { get; set; }
        public DateOnly? Dob { get; set; }
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        public InforGender? Gender { get; set; }
        public string? Address { get; set; }
        public DateTime? Update_At { get; set; }

    }
}
