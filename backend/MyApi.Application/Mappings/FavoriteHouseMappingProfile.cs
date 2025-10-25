using AutoMapper;
using MyApi.Domain.Entities;
using static MyApi.Application.DTOs.FavoriteHouseDTOs;

namespace MyApi.Application.Mappings
{
    public class FavoriteHouseMappingProfile : Profile
    {
        public FavoriteHouseMappingProfile()
        {
            // Ánh xạ từ Entity → DTO đọc dữ liệu
            CreateMap<FavoriteHouse, FavoriteHouseReadDto>()
                .ForMember(dest => dest.House, opt => opt.MapFrom(src => src.BoardingHouse))
                .ForMember(dest => dest.Room, opt => opt.MapFrom(src => src.Room));

            // Ánh xạ từ DTO tạo mới → Entity
            CreateMap<FavoriteHouseCreateDto, FavoriteHouse>()
                .ForMember(dest => dest.Created_At, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsFavorite, opt => opt.MapFrom(src => true));

            // Ánh xạ từ DTO cập nhật → Entity
            CreateMap<FavoriteHouseUpdateDto, FavoriteHouse>();
        }
    }
}
