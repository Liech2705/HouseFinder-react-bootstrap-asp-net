using AutoMapper;
using MyApi.Domain.Entities;
using MyApi.Application.DTOs.ChatConversationDtos;
using MyApi.Application.DTOs.ChatMessageDtos;

namespace MyApi.Application.Mappings
{
    public class ChatConversationMappingProfile : Profile
    {
        public ChatConversationMappingProfile()
        {
            // ChatConversation -> ChatConversationReadDto
            CreateMap<ChatConversation, ChatConversationReadDto>()
                .ForMember(dest => dest.RoomTitle, opt => opt.MapFrom(src => src.Room.Title))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.User_Name))
                .ForMember(dest => dest.HostName, opt => opt.MapFrom(src => src.Host.User_Name))
                .ForMember(dest => dest.ChatMessages, opt => opt.MapFrom(src => src.ChatMessages));

            // ChatConversationCreateDto -> ChatConversation
            CreateMap<ChatConversationCreateDto, ChatConversation>()
                .ForMember(dest => dest.Last_Message_At, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // ChatConversationUpdateDto -> ChatConversation
            CreateMap<ChatConversationUpdateDto, ChatConversation>();
        }
    }
}
