using MyApi.Domain.Enums;

namespace MyApi.Domain.Entities
{
    public class CheckBooking
    {
        public int Check_Id { get; set; }
        public int Booking_Id { get; set; }
        public string Image_Url { get; set; } = null!;
        public CheckType Check { get; set; } = CheckType.CheckIn;
        public DateTime Check_Date { get; set; }

        // Navigation
        public Booking Booking { get; set; } = null!;
    }
}
