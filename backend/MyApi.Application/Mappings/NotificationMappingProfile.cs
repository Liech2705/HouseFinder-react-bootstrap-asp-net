using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.NotificationDtos;

namespace MyApi.Application.Mappings
{
    public class NotificationMappingProfile : Profile
    {
        public NotificationMappingProfile()
        {
            // Notification -> NotificationReadDto
            CreateMap<Notification, NotificationReadDto>();

            // NotificationCreateDto -> Notification
            CreateMap<NotificationCreateDto, Notification>()
                .ForMember(dest => dest.Create_At, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Is_Read, opt => opt.MapFrom(_ => false)); // mặc định chưa đọc

            // NotificationUpdateDto -> Notification
            CreateMap<NotificationUpdateDto, Notification>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
