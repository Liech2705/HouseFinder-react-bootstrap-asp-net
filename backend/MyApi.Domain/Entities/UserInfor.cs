using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Domain.Entities
{
    public class UserInfor
    {
        [Key]
        public int Infor_Id { get; set; }

        [ForeignKey("User")]
        public int User_Id { get; set; }

        public DateTime? Dob { get; set; }

        [MaxLength(10)]
        public string? Phone { get; set; }

        [MaxLength(255)]
        public string? Avatar { get; set; }

        public DateTime? Update_At { get; set; }

        // Navigation
        public User User { get; set; }
    }
}
