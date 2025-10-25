using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyApi.Application.DTOs.ReportDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class ReportRepository : GenericRepository<Report>, IReportRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ReportRepository(AppDbContext context, IMapper mapper) : base(context)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ReportReadDto>> GetReportsWithNamesAsync(IConfigurationProvider mapperConfig)
        {
            var reports = await _context.Reports
                .OrderByDescending(r => r.Created_At)
                .ToListAsync();

            var result = new List<ReportReadDto>();

            foreach (var report in reports)
            {
                var dto = _mapper.Map<ReportReadDto>(report);

                switch (report.Type)
                {
                    case ReportType.User:
                        dto.Reported_Title = (await _context.Users.FindAsync(report.Reported_Id))?.User_Name ?? "Người dùng bị xóa";
                        break;
                    case ReportType.House:
                        dto.Reported_Title = (await _context.BoardingHouses.FindAsync(report.Reported_Id))?.House_Name ?? "Nhà trọ bị xóa";
                        break;
                    case ReportType.Message:
                        dto.Reported_Title = (await _context.ChatMessages.FindAsync(report.Reported_Id))?.Content ?? "Tin nhắn bị xóa";
                        break;
                    case ReportType.Review:
                        dto.Reported_Title = (await _context.Reviews.FindAsync(report.Reported_Id))?.Comment ?? "Đánh giá bị xóa";
                        break;
                }

                dto.Reporter_Name = (await _context.Users.FindAsync(report.Reporter_Id))?.User_Name ?? "Ẩn danh";
                result.Add(dto);
            }

            return result;
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

        public async Task<IEnumerable<Report>> GetByTypeAsync(ReportType type)
        {
            return await _context.Reports
                                 .Where(r => r.Type == type)
                                 .Include(r => r.Reporter)
                                 .ToListAsync();
        }

        public async Task<bool> UpdateStatusAsync(int id, ReportStatus newStatus)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report == null) return false;

            report.Status = newStatus;
            _context.Reports.Update(report);
            await _context.SaveChangesAsync();

            return true;
        }

    }
}
