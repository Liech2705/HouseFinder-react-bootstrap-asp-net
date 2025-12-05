using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Domain.Entities
{
    public class ChatConversation
    {
        public int Conversation_Id { get; set; }
        public int? Room_Id { get; set; }
        public int User_Id { get; set; }
        public int Host_Id { get; set; }

        public DateTime Last_Message_At { get; set; }

        // Navigation
        public Room? Room { get; set; }
        public User User { get; set; }
        public User Host { get; set; }
        public ICollection<ChatMessage> ChatMessages { get; set; }
    }
}
