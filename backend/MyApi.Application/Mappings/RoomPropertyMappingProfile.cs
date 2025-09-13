using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.RoomPropertyDtos;

namespace MyApi.Application.Mappings
{
    public class RoomPropertyMappingProfile : Profile
    {
        public RoomPropertyMappingProfile()
        {
            // RoomProperty -> RoomPropertyReadDto
            CreateMap<RoomProperty, RoomPropertyReadDto>();

            // RoomPropertyCreateDto -> RoomProperty
            CreateMap<RoomPropertyCreateDto, RoomProperty>()
                .ForMember(dest => dest.UpdateAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // RoomPropertyUpdateDto -> RoomProperty
            CreateMap<RoomPropertyUpdateDto, RoomProperty>()
                .ForMember(dest => dest.UpdateAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
