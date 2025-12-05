using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyApi.Application.DTOs.ChatConversationDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class ChatConversationRepository : GenericRepository<ChatConversation>, IChatConversationRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ChatConversationRepository(AppDbContext context, IMapper mapper) : base(context)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ChatConversation>> GetByUserIdAsync(int userId)
        {
            return await _context.ChatConversations
                                 .Where(c => c.User_Id == userId || c.Host_Id == userId)
                                 .Include(c => c.ChatMessages)
                                 .Include(c => c.User)
                                 .Include(c => c.Room)
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

        public async Task<ChatConversation> CreateConversationAsync(ChatConversationCreateDto dto)
        {
            var exists = await _context.ChatConversations.FirstOrDefaultAsync(c => c.Room_Id == dto.Room_Id && c.User_Id == dto.User_Id && c.Host_Id == dto.Host_Id);
            if (exists != null) return null;

            exists.Room_Id = dto.Room_Id;
            exists.User_Id = dto.User_Id;
            exists.Host_Id = dto.Host_Id;
            exists.Last_Message_At = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return exists;
        }

        public async Task<List<ChatMessage>> GetChatConversation(int id, int limit = 100)
        {
            return await _context.ChatMessages
                .Where(m => m.Conversation_Id == id)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<ChatConversation?> GetByUserAndHostIdAsync(int userId, int hostId)
        {
            return await _context.ChatConversations
                .Include(cc => cc.User)     // include thông tin người thuê
                .Include(cc => cc.Host)     // include thông tin chủ trọ
                .Include(cc => cc.Room)     // include thông tin phòng (nếu có)
                .Include(cc => cc.ChatMessages) // include danh sách tin nhắn
                .FirstOrDefaultAsync(cc =>
                    (cc.User_Id == userId && cc.Host_Id == hostId) ||
                    (cc.User_Id == hostId && cc.Host_Id == userId)
                );
        }
        
    }
}
