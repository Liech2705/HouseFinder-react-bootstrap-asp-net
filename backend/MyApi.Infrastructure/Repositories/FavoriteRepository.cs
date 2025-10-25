using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Data;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Infrastructure.Repositories
{
    public class FavoriteHouseRepository : GenericRepository<FavoriteHouse>, IFavoriteHouseRepository
    {
        public FavoriteHouseRepository(AppDbContext context) : base(context) { }

        public async Task<FavoriteHouse> GetByUserAndHouseAsync(int userId, int houseId, int? roomId)
        {
            return await _context.FavoriteHouses
                .FirstOrDefaultAsync(f => f.User_Id == userId && f.House_Id == houseId && f.Room_Id == roomId);
        }

        public async Task<IEnumerable<FavoriteHouse>> GetFavoritesByUserAsync(int userId)
        {
            return await _context.FavoriteHouses
                .Where(f => f.User_Id == userId && f.IsFavorite)
                .Include(f => f.BoardingHouse)
                .Include(f => f.Room)
                .ToListAsync();
        }
    }

}
