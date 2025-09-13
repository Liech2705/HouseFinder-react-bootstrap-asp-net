using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.ReportDtos;
using MyApi.Domain.Enums;

namespace MyApi.Application.Mappings
{
    public class ReportMappingProfile : Profile
    {
        public ReportMappingProfile()
        {
            // Report -> ReportReadDto
            CreateMap<Report, ReportReadDto>();

            // ReportCreateDto -> Report
            CreateMap<ReportCreateDto, Report>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => ReportStatus.Pending))
                .ForMember(dest => dest.Created_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // ReportUpdateDto -> Report
            CreateMap<ReportUpdateDto, Report>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
