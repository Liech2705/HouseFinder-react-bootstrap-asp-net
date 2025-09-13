using AutoMapper;
using MyApi.Application.DTOs.BookingDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

namespace MyApi.Application.Mappings
{
    public class BookingMappingProfile : Profile
    {
        public BookingMappingProfile()
        {
            // Booking -> BookingReadDto
            CreateMap<Booking, BookingReadDto>()
                .ForMember(dest => dest.RoomTitle, opt => opt.MapFrom(src => src.Room.Title))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.User_Name))
                .ForMember(dest => dest.Payments, opt => opt.MapFrom(src => src.Payments))
                .ForMember(dest => dest.CheckBookings, opt => opt.MapFrom(src => src.CheckBookings))
                .ForMember(dest => dest.Review, opt => opt.MapFrom(src => src.Review));

            // BookingCreateDto -> Booking
            CreateMap<BookingCreateDto, Booking>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => BookingStatus.Pending)) // mặc định Pending khi tạo mới
                .ForMember(dest => dest.Created_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // BookingUpdateDto -> Booking
            CreateMap<BookingUpdateDto, Booking>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            // chỉ map nếu giá trị DTO khác null, để không ghi đè các field không cập nhật
        }
    }
}
