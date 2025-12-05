using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IReviewRepository : IGenericRepository<Review>
    {
        Task<IEnumerable<Review>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Review>> GetByBookingIdAsync(int bookingId);
        
    }
}
