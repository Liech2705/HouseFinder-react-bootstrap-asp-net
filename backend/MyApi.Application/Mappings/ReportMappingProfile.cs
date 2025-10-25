using AutoMapper;
using MyApi.Application.DTOs.ReportDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

namespace MyApi.Application.Mappings
{
    public class ReportMappingProfile : Profile
    {
        public ReportMappingProfile()
        {
            // Report -> ReportReadDto
            CreateMap<Report, ReportReadDto>()
                .ForMember(dest => dest.Reporter_Name, opt => opt.MapFrom(src => src.Reporter.User_Name))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Reported_Title, opt => opt.Ignore()); // Tự xử lý riêng phần này

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
