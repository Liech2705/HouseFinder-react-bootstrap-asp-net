using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        private readonly AppDbContext _context;

        public PaymentRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetByBookingIdAsync(int bookingId)
        {
            return await _context.Payments
                                 .Where(p => p.Booking_Id == bookingId)
                                 .Include(p => p.Booking)
                                 .Include(p => p.UserPaymentMethod)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Payment>> GetByMethodIdAsync(int methodId)
        {
            return await _context.Payments
                                 .Where(p => p.Method_Id == methodId)
                                 .Include(p => p.Booking)
                                 .Include(p => p.UserPaymentMethod)
                                 .ToListAsync();
        }
    }
}
