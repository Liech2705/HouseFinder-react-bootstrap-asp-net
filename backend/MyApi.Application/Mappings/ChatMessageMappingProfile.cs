using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.ChatMessageDtos;

namespace MyApi.Application.Mappings
{
    public class ChatMessageMappingProfile : Profile
    {
        public ChatMessageMappingProfile()
        {
            // ChatMessage -> ChatMessageReadDto
            CreateMap<ChatMessage, ChatMessageReadDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.User_Name));

            // ChatMessageCreateDto -> ChatMessage
            CreateMap<ChatMessageCreateDto, ChatMessage>()
                .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // ChatMessageUpdateDto -> ChatMessage
            CreateMap<ChatMessageUpdateDto, ChatMessage>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            // chỉ map các property có giá trị, tránh ghi đè null
        }
    }
}
