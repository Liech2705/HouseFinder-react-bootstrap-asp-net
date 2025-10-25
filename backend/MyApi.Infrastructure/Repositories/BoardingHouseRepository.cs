using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
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
                                 .Include(u => u.User)
                                 .ToListAsync();
        }
        public async Task<BoardingHouse> HidenHouseAsync(int houseId)
        {
            var house = await _dbSet.FirstOrDefaultAsync(h =>  h.House_Id == houseId);
            if (house == null) return null;

            house.Status = HouseStatus.hiden;
            _dbSet.Update(house);
            await _context.SaveChangesAsync();
            return house;

        }
        public async Task<BoardingHouse> VisibleHouseAsync(int houseId)
        {
            var house = await _dbSet.FirstOrDefaultAsync(h => h.House_Id == houseId);
            if (house == null) return null;
            house.Status = HouseStatus.visible;
            _dbSet.Update(house);
            await _context.SaveChangesAsync();
            return house;
        }
    }
}
