using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class HouseImageRepository : GenericRepository<HouseImage>, IHouseImageRepository
    {
        private readonly AppDbContext _context;

        public HouseImageRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HouseImage>> GetByHouseIdAsync(int houseId)
        {
            return await _context.HouseImages
                                 .Where(h => h.House_Id == houseId)
                                 .Include(h => h.BoardingHouse)
                                 .ToListAsync();
        }
    }
}
