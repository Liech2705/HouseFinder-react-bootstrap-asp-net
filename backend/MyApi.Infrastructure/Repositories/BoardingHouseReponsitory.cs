using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;
using MyApi.Infrastructure.Repositories;

namespace MyApi.Infrastructure.Repositories
{
    public class BoardingHouseRepository : GenericRepository<BoardingHouse>, IBoardingHouseRepository
    {
        private readonly AppDbContext _context;

        public BoardingHouseRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BoardingHouse>> GetByUserIdAsync(int userId)
        {
            return await _context.BoardingHouses
                                 .Where(h => h.User_Id == userId)
                                 .ToListAsync();
        }
    }
}
