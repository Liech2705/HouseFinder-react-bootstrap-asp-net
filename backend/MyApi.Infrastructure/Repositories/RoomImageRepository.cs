using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class RoomImageRepository : GenericRepository<RoomImage>, IRoomImageRepository
    {
        private readonly AppDbContext _context;

        public RoomImageRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoomImage>> GetByRoomIdAsync(int roomId)
        {
            return await _context.RoomImages
                .Where(img => img.Room_Id == roomId)
                .ToListAsync();
        }
    }
}
