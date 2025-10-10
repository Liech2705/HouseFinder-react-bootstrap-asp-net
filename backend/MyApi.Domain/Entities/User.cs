using MyApi.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Domain.Entities
{
    public class User
    {
        [Key]
        public int User_Id { get; set; }

        [MaxLength(255)]
        public string User_Name { get; set; }

        [MaxLength(255)]
        public string Email { get; set; }

        public string PasswordHash { get; set; }

        [MaxLength(20)]
        public UserRole Role { get; set; } = UserRole.User;

        public DateTime? Created_At { get; set; }

        // Navigation
        public UserInfor UserInfor { get; set; }
        public ICollection<BoardingHouse> BoardingHouses { get; set; }
        public ICollection<Room> Rooms { get; set; }
        public ICollection<UserPaymentMethod> PaymentMethods { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<ChatMessage> chatMessages { get; set; } = new List<ChatMessage>();

        [InverseProperty(nameof(ChatConversation.User))]
        public ICollection<ChatConversation> ChatConversations { get; set; } = new List<ChatConversation>();

        [InverseProperty(nameof(ChatConversation.Host))]
        public ICollection<ChatConversation> HostConversations { get; set; } = new List<ChatConversation>();

        public ICollection<Report> Reports { get; set; } = new List<Report>();
    }
}
