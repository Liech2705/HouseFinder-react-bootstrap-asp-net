using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IPaymentRepository : IGenericRepository<Payment>
    {
        //Task<IEnumerable<Payment>> GetByBookingIdAsync(int bookingId);
        //Task<IEnumerable<Payment>> GetByMethodIdAsync(int methodId);
    }
}
