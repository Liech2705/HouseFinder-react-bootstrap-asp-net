using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class UserPaymentMethodRepository : GenericRepository<UserPaymentMethod>, IUserPaymentMethodRepository
    {
        private readonly AppDbContext _context;

        public UserPaymentMethodRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserPaymentMethod>> GetByUserIdAsync(int userId)
        {
            return await _context.UserPaymentMethods
                .Where(upm => upm.User_Id == userId)
                .ToListAsync();
        }
    }
}
