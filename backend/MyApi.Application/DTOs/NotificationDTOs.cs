using MyApi.Domain.Enums;

namespace MyApi.Application.DTOs.NotificationDtos
{
    // DTO để trả dữ liệu ra ngoài cho client
    public class NotificationReadDto
    {
        public int Notification_Id { get; set; }
        public int User_Id { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public bool Is_Read { get; set; }
        public NotificationType Type { get; set; }
        public DateTime Create_At { get; set; }
    }

    // DTO khi client tạo mới thông báo
    public class NotificationCreateDto
    {
        public int User_Id { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public NotificationType Type { get; set; } = NotificationType.General;
    }

    // DTO khi client cập nhật thông báo
    public class NotificationUpdateDto
    {
        public bool Is_Read { get; set; }
    }
}
