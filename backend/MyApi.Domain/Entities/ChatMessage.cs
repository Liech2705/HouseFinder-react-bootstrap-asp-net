
using System.ComponentModel.DataAnnotations;

namespace MyApi.Domain.Entities
{
    public class ChatMessage
    {
        [Key]
        public int Message_Id { get; set; }
        public int Conversation_Id { get; set; }
        public int User_Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }

        // Navigation
        public ChatConversation ChatConversation { get; set; }
        public User User { get; set; }
    }

}
