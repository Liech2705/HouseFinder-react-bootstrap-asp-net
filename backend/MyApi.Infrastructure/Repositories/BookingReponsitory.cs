using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(int userId)
        {
            return await _context.Bookings
                                 .Where(b => b.User_Id == userId)
                                 .Include(b => b.Room)   // load thêm nếu cần
                                 .Include(b => b.User)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetByRoomIdAsync(int roomId)
        {
            return await _context.Bookings
                                 .Where(b => b.Room_Id == roomId)
                                 .Include(b => b.Room)
                                 .Include(b => b.User)
                                 .ToListAsync();
        }
    }
}
