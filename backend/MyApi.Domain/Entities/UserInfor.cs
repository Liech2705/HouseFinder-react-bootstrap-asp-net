using MyApi.Domain.Enums;
namespace MyApi.Domain.Entities
{
    public class UserInfor
    {
        public int Infor_Id { get; set; }

        public int User_Id { get; set; }

        public DateOnly? Dob { get; set; }

        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        public InforGender? Gender { get; set; }
        public string? Address { get; set; }

        public DateTime? Update_At { get; set; }

        // Navigation
        public User User { get; set; }
    }
}
