using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.CheckBookingDtos;
using MyApi.Domain.Enums;

namespace MyApi.Application.Mappings
{
    public class CheckBookingMappingProfile : Profile
    {
        public CheckBookingMappingProfile()
        {
            // CheckBooking -> CheckBookingReadDto
            CreateMap<CheckBooking, CheckBookingReadDto>()
                .ForMember(dest => dest.Check, opt => opt.MapFrom(src => src.Check.ToString()));
            // convert enum -> string để client dễ đọc

            // CheckBookingCreateDto -> CheckBooking
            CreateMap<CheckBookingCreateDto, CheckBooking>()
                .ForMember(dest => dest.Check, opt => opt.MapFrom(src => (CheckType)src.Check));
            // convert int -> enum

            // CheckBookingUpdateDto -> CheckBooking
            CreateMap<CheckBookingUpdateDto, CheckBooking>()
                .ForMember(dest => dest.Check, opt => opt.MapFrom(src => (CheckType)src.Check))
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            // chỉ update property không null
        }
    }
}
