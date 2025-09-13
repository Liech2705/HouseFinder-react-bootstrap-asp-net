using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.PaymentDtos;
using MyApi.Domain.Enums;

namespace MyApi.Application.Mappings
{
    public class PaymentMappingProfile : Profile
    {
        public PaymentMappingProfile()
        {
            // Payment -> PaymentReadDto
            CreateMap<Payment, PaymentReadDto>();

            // PaymentCreateDto -> Payment
            CreateMap<PaymentCreateDto, Payment>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => PaymentStatus.Pending)) // mặc định Pending
                .ForMember(dest => dest.Paid_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // PaymentUpdateDto -> Payment
            CreateMap<PaymentUpdateDto, Payment>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
