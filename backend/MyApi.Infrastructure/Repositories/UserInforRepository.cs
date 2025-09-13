using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class UserInforRepository : GenericRepository<UserInfor>, IUserInforRepository
    {
        private readonly AppDbContext _context;

        public UserInforRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<UserInfor?> GetByUserIdAsync(int userId)
        {
            return await _context.UserInfors
                .FirstOrDefaultAsync(ui => ui.User_Id == userId);
        }
    }
}
