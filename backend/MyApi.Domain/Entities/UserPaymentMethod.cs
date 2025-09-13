using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MyApi.Domain.Entities
{
    public class UserPaymentMethod
    {
        [Key]
        public int Payment_Method_Id { get; set; }

        [ForeignKey("User")]
        public int User_Id { get; set; }

        [MaxLength(255)]
        public string Account_User_Name { get; set; }

        [MaxLength(255)]
        public string Bank_Account_Number { get; set; }

        [MaxLength(255)]
        public string Bank_Name { get; set; }

        public bool? Status { get; set; }

        public DateTime? Create_At { get; set; }

        // Navigation
        public User User { get; set; }
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
