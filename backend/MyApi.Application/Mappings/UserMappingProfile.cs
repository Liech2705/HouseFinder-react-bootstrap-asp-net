using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.UserDtos;

namespace MyApi.Application.Mappings
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            // User -> UserReadDto (kèm UserInfor và BoardingHouses)
            CreateMap<User, UserReadDto>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role))
                .ForMember(dest => dest.UserInfor, opt => opt.MapFrom(src => src.UserInfor))
                .ForMember(dest => dest.BoardingHouses, opt => opt.MapFrom(src => src.BoardingHouses));

            // UserCreateDto -> User
            CreateMap<UserCreateDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // hash password ở service
                .ForMember(dest => dest.Created_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // UserUpdateDto -> User
            CreateMap<UserUpdateDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); // hash nếu đổi pass
        }
    }
}
