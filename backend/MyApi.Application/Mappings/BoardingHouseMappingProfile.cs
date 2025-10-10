using AutoMapper;
using MyApi.Application.DTOs.BoardingHouseDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

namespace MyApi.Application.Mappings
{
    public class BoardingHouseMappingProfile : Profile
    {
        public BoardingHouseMappingProfile()
        {
            // BoardingHouse -> BoardingHouseReadDto
            CreateMap<BoardingHouse, BoardingHouseReadDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.User_Name)) // lấy tên User
                .ForMember(dest => dest.Rooms, opt => opt.MapFrom(src => src.Rooms))
                .ForMember(dest => dest.HouseImages, opt => opt.MapFrom(src => src.HouseImages));

            // BoardingHouseCreateDto -> BoardingHouse
            CreateMap<BoardingHouseCreateDto, BoardingHouse>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => HouseStatus.visible)) // mặc định khi tạo mới
                .ForMember(dest => dest.Create_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // BoardingHouseUpdateDto -> BoardingHouse
            CreateMap<BoardingHouseUpdateDto, BoardingHouse>();
        }
    }
}
