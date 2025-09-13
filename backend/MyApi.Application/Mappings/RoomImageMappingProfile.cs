using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.RoomImageDtos;

namespace MyApi.Application.Mappings
{
    public class RoomImageMappingProfile : Profile
    {
        public RoomImageMappingProfile()
        {
            // RoomImage -> RoomImageReadDto
            CreateMap<RoomImage, RoomImageReadDto>();

            // RoomImageCreateDto -> RoomImage
            CreateMap<RoomImageCreateDto, RoomImage>()
                .ForMember(dest => dest.Uploaded_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // RoomImageUpdateDto -> RoomImage
            CreateMap<RoomImageUpdateDto, RoomImage>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
