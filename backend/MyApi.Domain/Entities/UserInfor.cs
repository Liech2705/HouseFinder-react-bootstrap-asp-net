using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Domain.Entities
{
    public class UserInfor
    {
        public int Infor_Id { get; set; }

        public int User_Id { get; set; }

        public DateTime? Dob { get; set; }

        public string? Phone { get; set; }
        public string? Avatar { get; set; }

        public DateTime? Update_At { get; set; }

        // Navigation
        public User User { get; set; }
    }
}
