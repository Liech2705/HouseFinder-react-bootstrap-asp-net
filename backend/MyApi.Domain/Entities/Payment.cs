using MyApi.Domain.Enums;

namespace MyApi.Domain.Entities
{
    public class Payment
    {
        public int Payment_Id { get; set; }
        public int Booking_Id { get; set; }
        public int Transaction_Id { get; set; }
        public int Method_Id { get; set; }
        public int Amount { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;  // Có thể đổi thành enum
        public DateTime Paid_At { get; set; }

        // Navigation
        public Booking Booking { get; set; }
        public UserPaymentMethod UserPaymentMethod { get; set; }
    }

}
