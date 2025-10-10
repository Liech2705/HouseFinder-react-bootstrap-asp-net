using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.RoomDtos;

namespace MyApi.Application.Mappings
{
    public class RoomMappingProfile : Profile
    {
        public RoomMappingProfile()
        {
            // Room -> RoomReadDto
            CreateMap<Room, RoomReadDto>()
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.Owner.User_Name))
                .ForMember(dest => dest.HouseDescription, opt => opt.MapFrom(src => src.BoardingHouse.Description))
                .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.Reviews))
                .ForMember(dest => dest.RoomImages, opt => opt.MapFrom(src => src.RoomImages))
                .ForMember(dest => dest.RoomProperty, opt => opt.MapFrom(src => src.RoomProperty));

            // RoomCreateDto -> Room
            CreateMap<RoomCreateDto, Room>()
                .ForMember(dest => dest.Created_At, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => MyApi.Domain.Enums.RoomStatus.visible));

            // RoomUpdateDto -> Room
            CreateMap<RoomUpdateDto, Room>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
