using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> LockedAsync(int userId, DateTime timeLock, string reasonLock);
        Task<User?> UnLockAsync(int userId, string resonUnlock = "");
    }
}
