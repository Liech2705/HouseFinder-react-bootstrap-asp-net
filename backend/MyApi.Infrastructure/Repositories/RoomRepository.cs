using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class RoomRepository : GenericRepository<Room>, IRoomRepository
    {
        private readonly AppDbContext _context;

        public RoomRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Room>> GetByOwnerIdAsync(int ownerId)
        {
            return await _context.Rooms
                .Where(r => r.Owner_Id == ownerId)
                .Include(r => r.RoomImages)
                .Include(r => r.BoardingHouse)
                .ToListAsync();
        }

        public async Task<IEnumerable<Room>> GetByHouseIdAsync(int houseId)
        {
            return await _context.Rooms
                .Where(r => r.House_Id == houseId)
                .Include(r => r.RoomImages)
                .Include(r => r.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Room>> GetByStatusAsync(RoomStatus status)
        {
            return await _context.Rooms
                .Where(r => r.Status == status)
                .Include(r => r.RoomImages)
                .ToListAsync();
        }

        public async Task<IEnumerable<Room>> SearchByTitleOrAddressAsync(string keyword)
        {
            return await _context.Rooms
                .Where(r => r.Title.Contains(keyword) || r.Address.Contains(keyword))
                .Include(r => r.RoomImages)
                .Include(r => r.BoardingHouse)
                .ToListAsync();
        }
    }
}
