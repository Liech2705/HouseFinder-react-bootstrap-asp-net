using MyApi.Domain.Enums;
namespace MyApi.Domain.Entities
{

    public class Booking
    {
        public int Booking_Id { get; set; }
        public int Room_Id { get; set; }
        public int User_Id { get; set; }
        public long Amount { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        
        public DateOnly? Check_In_Date { get; set; }
        public DateOnly? Check_Out_Date { get; set; }
        public DateTime Created_At { get; set; }

        // Navigation
        public Room Room { get; set; }
        public User User { get; set; }
        public ICollection<Payment> Payments { get; set; }
        public ICollection<CheckBooking> CheckBookings { get; set; }
    }

}
