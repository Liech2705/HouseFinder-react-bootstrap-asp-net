using MyApi.Domain.Enums;

namespace MyApi.Domain.Entities
{
    public class Payment
    {
        public int Payment_Id { get; set; }
        public int Booking_Id { get; set; }
        public string Transaction_Id { get; set; }
        //public int Method_Id { get; set; }
        public MethodPayment Method_Paid { get; set; }
        public long Deposit { get; set; } // tiền cọc (có ít hơn hoặc bằng tiền phòng)
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;  // Có thể đổi thành enum
        public DateTime Paid_At { get; set; }

        // Navigation
        public Booking Booking { get; set; }
        //public UserPaymentMethod UserPaymentMethod { get; set; }
    }

}
