using MyApi.Application.DTOs.ChatMessageDtos;

namespace MyApi.Application.DTOs.ChatConversationDtos
{
    // POST: khi bắt đầu cuộc trò chuyện
    public class ChatConversationCreateDto
    {
        public int Room_Id { get; set; }
        public int User_Id { get; set; }   // người thuê
        public int Host_Id { get; set; }   // chủ trọ
    }

    // PUT/PATCH: khi cần cập nhật metadata (vd: Last_Message_At)
    public class ChatConversationUpdateDto
    {
        public DateTime Last_Message_At { get; set; }
    }

    // GET: trả về client
    public class ChatConversationReadDto
    {
        public int Conversation_Id { get; set; }
        public int Room_Id { get; set; }
        public int User_Id { get; set; }
        public int Host_Id { get; set; }
        public DateTime Last_Message_At { get; set; }

        // Thông tin quan hệ
        public string? RoomTitle { get; set; }      // từ Room.Title
        public string? UserName { get; set; }       // từ User.User_Name
        public string? HostName { get; set; }       // từ Host.User_Name

        public ICollection<ChatMessageReadDto> ChatMessages { get; set; } = new List<ChatMessageReadDto>();
    }
}
