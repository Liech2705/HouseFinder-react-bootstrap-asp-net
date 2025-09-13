using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.HouseImageDtos;

namespace MyApi.Application.Mappings
{
    public class HouseImageMappingProfile : Profile
    {
        public HouseImageMappingProfile()
        {
            // HouseImage -> HouseImageReadDto
            CreateMap<HouseImage, HouseImageReadDto>();

            // HouseImageCreateDto -> HouseImage
            CreateMap<HouseImageCreateDto, HouseImage>()
                .ForMember(dest => dest.Uploaded_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // HouseImageUpdateDto -> HouseImage
            CreateMap<HouseImageUpdateDto, HouseImage>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
