using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IChatMessageRepository : IGenericRepository<ChatMessage>
    {
        Task<IEnumerable<ChatMessage>> GetByConversationIdAsync(int conversationId);
        Task<IEnumerable<ChatMessage>> GetByUserIdAsync(int userId);
    }
}
