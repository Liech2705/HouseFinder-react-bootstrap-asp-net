namespace MyApi.Application.DTOs.ChatMessageDtos
{
    // POST: gửi tin nhắn mới
    public class ChatMessageCreateDto
    {
        public int Conversation_Id { get; set; }
        public int User_Id { get; set; }
        public string Content { get; set; }
    }

    // PUT/PATCH: sửa tin nhắn (nếu cho phép)
    public class ChatMessageUpdateDto
    {
        public string Content { get; set; }
    }

    // GET: trả dữ liệu về client
    public class ChatMessageReadDto
    {
        public int Message_Id { get; set; }
        public int Conversation_Id { get; set; }
        public int User_Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }

        // Thông tin bổ sung
        public string UserName { get; set; }   // từ User.User_Name
    }
}
