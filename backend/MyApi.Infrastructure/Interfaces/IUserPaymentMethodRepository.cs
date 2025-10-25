using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IUserPaymentMethodRepository : IGenericRepository<UserPaymentMethod>
    {
        Task<IEnumerable<UserPaymentMethod>> GetByUserIdAsync(int userId);
    }
}
