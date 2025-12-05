using MyApi.Application.DTOs.ChatConversationDtos;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IChatConversationRepository : IGenericRepository<ChatConversation>
    {
        Task<IEnumerable<ChatConversation>> GetByUserIdAsync(int userId);
        Task<IEnumerable<ChatConversation>> GetByHostIdAsync(int hostId);
        Task<IEnumerable<ChatConversation>> GetByRoomIdAsync(int roomId);
        Task<ChatConversation> GetByUserAndHostIdAsync(int userId,  int hostId);
        Task<ChatConversation> CreateConversationAsync(ChatConversationCreateDto dto);
        Task<List<ChatMessage>> GetChatConversation(int id, int limit = 100);
    }
}
