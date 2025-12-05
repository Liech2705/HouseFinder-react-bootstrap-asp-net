using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class RoomRepository : GenericRepository<Room>, IRoomRepository
    {
        private readonly AppDbContext _context;
        private readonly IHostEnvironment _env;

        public RoomRepository(AppDbContext context, IHostEnvironment env) : base(context)
        {
            _context = context;
            _env = env;
        }

        public async override Task<Room?> GetByIdAsync(int id)
        {
            return await _dbSet.Include(r => r.Owner)
                               .Include(r => r.BoardingHouse)
                               .Include(r => r.RoomProperty)
                               .Include(r => r.RoomImages)
                               .Include(r => r.Reviews)
                                 .ThenInclude(rv => rv.User)
                               .FirstOrDefaultAsync(r => r.Room_Id == id);
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
                .Include(r => r.Owner)
                .Include(r => r.RoomProperty)
                .Include(r => r.Reviews)
                .ToListAsync();
        }

        public async Task<IEnumerable<Room>> GetByStatusAsync(RoomStatus status)
        {
            return await _context.Rooms
                .Where(r => r.Status == status)
                .Include(r => r.RoomImages)
                .ToListAsync();
        }

        public async Task<List<Room>> GetAvailableRoomAsync(int houseId)
        {
            var availableRooms = await _dbSet.Where(r => r.House_Id == houseId && r.Bookings.Any()).ToListAsync();
            return availableRooms;
        }

        public async Task ChangeStatusRoomAsync(int id, string roomStatus)
        {
            var room = await _dbSet.FindAsync(id);
            if (room == null) { return; }

            if (roomStatus == "visible")
            {
                room.Status = RoomStatus.visible;
            }
            else if (roomStatus == "hidden")
            {
                room.Status = RoomStatus.hidden;
            }
            _dbSet.Update(room);
            _context.SaveChanges();
        }
    }
}
