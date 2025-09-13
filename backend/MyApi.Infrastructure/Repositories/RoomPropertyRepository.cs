using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class RoomPropertyRepository : GenericRepository<RoomProperty>, IRoomPropertyRepository
    {
        private readonly AppDbContext _context;

        public RoomPropertyRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<RoomProperty?> GetByRoomIdAsync(int roomId)
        {
            return await _context.RoomProperties
                .FirstOrDefaultAsync(rp => rp.RoomId == roomId);
        }
    }
}
