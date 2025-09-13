using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class ChatConversationRepository : GenericRepository<ChatConversation>, IChatConversationRepository
    {
        private readonly AppDbContext _context;

        public ChatConversationRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ChatConversation>> GetByUserIdAsync(int userId)
        {
            return await _context.ChatConversations
                                 .Where(c => c.User_Id == userId)
                                 .Include(c => c.ChatMessages)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<ChatConversation>> GetByHostIdAsync(int hostId)
        {
            return await _context.ChatConversations
                                 .Where(c => c.Host_Id == hostId)
                                 .Include(c => c.ChatMessages)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<ChatConversation>> GetByRoomIdAsync(int roomId)
        {
            return await _context.ChatConversations
                                 .Where(c => c.Room_Id == roomId)
                                 .Include(c => c.ChatMessages)
                                 .ToListAsync();
        }
    }
}
