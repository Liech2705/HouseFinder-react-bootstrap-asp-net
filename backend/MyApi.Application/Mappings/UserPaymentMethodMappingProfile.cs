using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.UserPaymentMethodDtos;

namespace MyApi.Application.Mappings
{
    public class UserPaymentMethodMappingProfile : Profile
    {
        public UserPaymentMethodMappingProfile()
        {
            // UserPaymentMethod -> UserPaymentMethodReadDto
            CreateMap<UserPaymentMethod, UserPaymentMethodReadDto>();

            // UserPaymentMethodCreateDto -> UserPaymentMethod
            CreateMap<UserPaymentMethodCreateDto, UserPaymentMethod>()
                .ForMember(dest => dest.Create_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // UserPaymentMethodUpdateDto -> UserPaymentMethod
            CreateMap<UserPaymentMethodUpdateDto, UserPaymentMethod>()
                .ForMember(dest => dest.Create_At, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
