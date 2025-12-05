namespace MyApi.Domain.Entities
{
    public class UserPaymentMethod
    {
        public int Payment_Method_Id { get; set; }

        public int User_Id { get; set; }

        public string Account_User_Name { get; set; }

        public string Bank_Account_Number { get; set; }
        public string Bank_Name { get; set; }

        public bool? Status { get; set; }

        public DateTime? Create_At { get; set; }

        // Navigation
        public User User { get; set; }
        //public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
