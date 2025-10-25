using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;
using System.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<IEnumerable<TDto>> GetAllAsync<TDto>(IConfigurationProvider mapperConfig)
        {
            return await _dbSet
                .Where(u => u.Role != UserRole.Admin)
                .ProjectTo<TDto>(mapperConfig)
                .ToListAsync();
        }
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                                 .Include(u => u.UserInfor)
                                 .Include(u => u.BoardingHouses)
                                 .Include(u => u.Rooms)
                                 .Include(u => u.PaymentMethods)
                                 .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> LockedAsync(int userId, DateTime timeLock, string reasonLock)
        {
            var user = await _dbSet.FirstOrDefaultAsync(u => u.User_Id == userId);
            if (user == null) { return null; }
            user.Lock_Until = timeLock;
            user.Reason = reasonLock;
            _dbSet.Update(user);
            await _context.SaveChangesAsync();
            return user;

        }
        
        public async Task<User?> UnLockAsync(int userId, string resonUnlock = "")
        {
            var user = await _dbSet.FirstOrDefaultAsync(u => u.User_Id == userId);
            if (user == null) { return null; }

            user.Lock_Until = null;
            user.Reason = resonUnlock;
            _dbSet.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
