using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        private readonly AppDbContext _context;

        public ReviewRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<IEnumerable<TDto>> GetAllAsync<TDto>(IConfigurationProvider mapperConfig)
        {
            return await _dbSet.Include(rv => rv.User).ProjectTo<TDto>(mapperConfig).ToListAsync();
        }

        public async Task<IEnumerable<Review>> GetByUserIdAsync(int userId)
        {
            return await _context.Reviews
                .Where(r => r.User_Id == userId)
                .Include(r => r.User)
                .Include(r => r.Room)
                .ToListAsync();
        }

        public async Task<IEnumerable<Review>> GetByBookingIdAsync(int bookingId)
        {
            return await _context.Reviews
                .Where(r => r.Room_Id == bookingId)
                .Include(r => r.User)
                .Include(r => r.Room)
                .ToListAsync();
        }
    }
}
