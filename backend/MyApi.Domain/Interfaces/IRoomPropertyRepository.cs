using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IRoomPropertyRepository : IGenericRepository<RoomProperty>
    {
        Task<RoomProperty?> GetByRoomIdAsync(int roomId);
    }
}
