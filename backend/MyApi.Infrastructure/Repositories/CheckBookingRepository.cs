using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class CheckBookingRepository : GenericRepository<CheckBooking>, ICheckBookingRepository
    {
        private readonly AppDbContext _context;

        public CheckBookingRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CheckBooking>> GetByBookingIdAsync(int bookingId)
        {
            return await _context.CheckBookings
                                 .Where(c => c.Booking_Id == bookingId)
                                 .Include(c => c.Booking)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<CheckBooking>> GetByTypeAsync(CheckType type)
        {
            return await _context.CheckBookings
                                 .Where(c => c.Check == type)
                                 .Include(c => c.Booking)
                                 .ToListAsync();
        }
    }
}
