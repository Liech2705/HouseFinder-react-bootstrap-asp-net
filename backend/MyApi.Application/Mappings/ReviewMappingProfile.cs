using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.ReviewDtos;

namespace MyApi.Application.Mappings
{
    public class ReviewMappingProfile : Profile
    {
        public ReviewMappingProfile()
        {
            // Review -> ReviewReadDto
            CreateMap<Review, ReviewReadDto>()
                .ForMember(dest => dest.User_Name, opt => opt.MapFrom(src => src.User.User_Name));

            // ReviewCreateDto -> Review
            CreateMap<ReviewCreateDto, Review>()
                .ForMember(dest => dest.Created_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // ReviewUpdateDto -> Review
            CreateMap<ReviewUpdateDto, Review>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
