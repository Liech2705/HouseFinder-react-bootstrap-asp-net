using MyApi.Domain.Enums;
using System.ComponentModel.DataAnnotations;
namespace MyApi.Domain.Entities
{

    public class Booking
    {
        [Key]
        public int Booking_Id { get; set; }
        public int Room_Id { get; set; }
        public int User_Id { get; set; }
        public int Amount { get; set; }
        public BookingStatus Status { get; set; }
        public DateTime Check_In_Date { get; set; }
        public DateTime Check_Out_Date { get; set; }
        public DateTime Created_At { get; set; }

        // Navigation
        public Room Room { get; set; }
        public User User { get; set; }
        public ICollection<Payment> Payments { get; set; }
        public ICollection<CheckBooking> CheckBookings { get; set; }
        public Review Review { get; set; }
    }

}
