using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IRoomRepository : IGenericRepository<Room>
    {
        Task<IEnumerable<Room>> GetByOwnerIdAsync(int ownerId);
        Task<IEnumerable<Room>> GetByHouseIdAsync(int houseId);
        Task<IEnumerable<Room>> GetByStatusAsync(RoomStatus status);
        Task<IEnumerable<Room>> SearchByTitleOrAddressAsync(string keyword);
    }
}
