using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IRoomImageRepository : IGenericRepository<RoomImage>
    {
        Task<IEnumerable<RoomImage>> GetByRoomIdAsync(int roomId);
    }
}
