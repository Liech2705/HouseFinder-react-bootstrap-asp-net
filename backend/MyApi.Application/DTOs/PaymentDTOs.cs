using MyApi.Domain.Enums;

namespace MyApi.Application.DTOs.PaymentDtos
{
    // DTO để trả dữ liệu ra ngoài cho client
    public class PaymentReadDto
    {
        public int Payment_Id { get; set; }
        public int Booking_Id { get; set; }
        public string Transaction_Id { get; set; }
        //public int Method_Id { get; set; }
        public MethodPayment Method_Paid { get; set; }
        public long Deposit { get; set; }
        public PaymentStatus Status { get; set; }
        public DateTime Paid_At { get; set; }
    }

    // DTO khi client tạo mới payment
    public class PaymentCreateDto
    {
        public int Booking_Id { get; set; }
        public string Transaction_Id { get; set; }
        public MethodPayment Method_Paid { get; set; }
        //public int Method_Id { get; set; }
        public long Deposit { get; set; }
    }

    // DTO khi client cập nhật payment
    public class PaymentUpdateDto
    {
        public PaymentStatus Status { get; set; }
    }
}
