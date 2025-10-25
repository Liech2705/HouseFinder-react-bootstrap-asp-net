using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface ICheckBookingRepository : IGenericRepository<CheckBooking>
    {
        Task<IEnumerable<CheckBooking>> GetByBookingIdAsync(int bookingId);
        Task<IEnumerable<CheckBooking>> GetByTypeAsync(CheckType type);
    }
}
