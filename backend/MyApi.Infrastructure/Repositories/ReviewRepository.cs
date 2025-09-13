using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        private readonly AppDbContext _context;

        public ReviewRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Review>> GetByUserIdAsync(int userId)
        {
            return await _context.Reviews
                .Where(r => r.User_Id == userId)
                .Include(r => r.User)
                .Include(r => r.Booking)
                .ToListAsync();
        }

        public async Task<IEnumerable<Review>> GetByBookingIdAsync(int bookingId)
        {
            return await _context.Reviews
                .Where(r => r.Booking_Id == bookingId)
                .Include(r => r.User)
                .Include(r => r.Booking)
                .ToListAsync();
        }
    }
}
