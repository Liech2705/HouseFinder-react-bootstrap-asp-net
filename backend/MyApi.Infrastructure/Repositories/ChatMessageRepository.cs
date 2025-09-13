using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class ChatMessageRepository : GenericRepository<ChatMessage>, IChatMessageRepository
    {
        private readonly AppDbContext _context;

        public ChatMessageRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ChatMessage>> GetByConversationIdAsync(int conversationId)
        {
            return await _context.ChatMessages
                                 .Where(m => m.Conversation_Id == conversationId)
                                 .Include(m => m.User)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<ChatMessage>> GetByUserIdAsync(int userId)
        {
            return await _context.ChatMessages
                                 .Where(m => m.User_Id == userId)
                                 .Include(m => m.ChatConversation)
                                 .ToListAsync();
        }
    }
}
