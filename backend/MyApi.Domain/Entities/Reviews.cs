using MyApi.Domain.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Review
{
    [Key]
    public int Review_Id { get; set; }
    public int User_Id { get; set; }

    [ForeignKey("Booking")] // ✅ Chỉ rõ bên phụ thuộc
    public int Booking_Id { get; set; }

    public byte Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime Created_At { get; set; }

    // Navigation
    public User User { get; set; }
    public Booking Booking { get; set; }
}
