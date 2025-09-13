using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IUserInforRepository : IGenericRepository<UserInfor>
    {
        Task<UserInfor?> GetByUserIdAsync(int userId);
    }
}
