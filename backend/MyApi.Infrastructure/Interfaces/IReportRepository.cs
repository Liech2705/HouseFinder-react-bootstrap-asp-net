using AutoMapper;
using MyApi.Application.DTOs.ReportDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IReportRepository : IGenericRepository<Report>
    {
        Task<IEnumerable<Report>> GetByReporterIdAsync(int reporterId);
        Task<IEnumerable<Report>> GetByReportedIdAsync(int reportedId);
        Task<IEnumerable<Report>> GetByTypeAsync(ReportType type);
        Task<IEnumerable<ReportReadDto>> GetReportsWithNamesAsync(IConfigurationProvider configurationProvider);
        Task<bool> UpdateStatusAsync(int id, ReportStatus newStatus);

    }
}
