using Microsoft.AspNetCore.SignalR;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Data;
public class ChatHub : Hub
{
    private readonly AppDbContext _context;

    public ChatHub(AppDbContext context)
    {
        _context = context;
    }

    public async Task SendMessage(int conversationId, int userId, string content)
    {
        // kiểm tra null
        if (string.IsNullOrWhiteSpace(content))
            throw new Exception("Message content is empty");

        Console.WriteLine($"[SendMessage] conv={conversationId}, user={userId}, content={content}");

        var message = new ChatMessage
        {
            Conversation_Id = conversationId,
            User_Id = userId,
            Content = content,
            Timestamp = DateTime.UtcNow
        };

        // Lưu vào database
        _context.ChatMessages.Add(message);
        await _context.SaveChangesAsync();

        // Gửi tin nhắn đến tất cả client trong cùng conversation
        await Clients.Group(conversationId.ToString())
            .SendAsync("ReceiveMessage", new
            {
                message.Message_Id,
                message.Conversation_Id,
                message.User_Id,
                message.Content,
                message.Timestamp
            });
    }

    public async Task JoinConversation(int conversationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        await Clients.Caller.SendAsync("JoinedConversation", conversationId);
    }
}
