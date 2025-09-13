using MyApi.Domain.Enums;

namespace MyApi.Domain.Entities
{
    public class Notification
    {
        public int Notification_Id { get; set; }
        public int User_Id { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public bool Is_Read { get; set; }
        public NotificationType Type { get; set; } = NotificationType.General;
        public DateTime Create_At { get; set; }

        // Navigation
        public User User { get; set; } = null!;
    }
}
