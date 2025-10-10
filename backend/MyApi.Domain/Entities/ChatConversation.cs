using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Domain.Entities
{
    public class ChatConversation
    {
        [Key]
        public int Conversation_Id { get; set; }

        [ForeignKey(nameof(Room))]
        public int Room_Id { get; set; }

        [ForeignKey(nameof(User))]
        public int User_Id { get; set; }

        [ForeignKey(nameof(Host))]
        public int Host_Id { get; set; }

        public DateTime Last_Message_At { get; set; }

        // Navigation
        public Room Room { get; set; }
        public User User { get; set; }
        public User Host { get; set; }
        public ICollection<ChatMessage> ChatMessages { get; set; }
    }
}
