using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Interfaces
{
    public interface IFavoriteHouseRepository : IGenericRepository<FavoriteHouse>
    {
        Task<FavoriteHouse> GetByUserAndHouseAsync(int userId, int houseId, int? roomId);
        Task<IEnumerable<FavoriteHouse>> GetFavoritesByUserAsync(int userId);
    }
}
