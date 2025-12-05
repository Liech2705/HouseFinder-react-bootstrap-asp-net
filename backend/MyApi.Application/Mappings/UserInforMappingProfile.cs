using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.UserInforDtos;

namespace MyApi.Application.Mappings
{
    public class UserInforMappingProfile : Profile
    {
        public UserInforMappingProfile()
        {
            // UserInfor -> UserInforReadDto
            CreateMap<UserInfor, UserInforReadDto>();

            // UserInforCreateDto -> UserInfor
            CreateMap<UserInforCreateDto, UserInfor>()
                .ForMember(dest => dest.Update_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // UserInforUpdateDto -> UserInfor
            CreateMap<UserInforUpdateDto, UserInfor>()
                .ForMember(dest => dest.Update_At, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.User, opt => opt.Ignore()) // không cập nhật navigation
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UserInfor, UserInforUpdateDto>();
        }
    }
}
