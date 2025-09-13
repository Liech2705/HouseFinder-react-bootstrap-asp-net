using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context) : base(context)
        {
            _context = context;
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
    }
}
