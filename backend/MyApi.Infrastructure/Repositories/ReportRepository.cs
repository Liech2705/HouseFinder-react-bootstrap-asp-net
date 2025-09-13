using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class ReportRepository : GenericRepository<Report>, IReportRepository
    {
        private readonly AppDbContext _context;

        public ReportRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Report>> GetByReporterIdAsync(int reporterId)
        {
            return await _context.Reports
                                 .Where(r => r.Reporter_Id == reporterId)
                                 .Include(r => r.Reporter)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetByReportedIdAsync(int reportedId)
        {
            return await _context.Reports
                                 .Where(r => r.Reported_Id == reportedId)
                                 .Include(r => r.Reporter)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetByStatusAsync(ReportStatus status)
        {
            return await _context.Reports
                                 .Where(r => r.Status == status)
                                 .Include(r => r.Reporter)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetByTypeAsync(ReportType type)
        {
            return await _context.Reports
                                 .Where(r => r.Type == type)
                                 .Include(r => r.Reporter)
                                 .ToListAsync();
        }
    }
}
