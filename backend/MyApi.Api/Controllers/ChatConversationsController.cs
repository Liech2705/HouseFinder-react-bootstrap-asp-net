using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.ChatConversationDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatConversationsController : ControllerBase
    {
        private readonly IChatConversationRepository _chatConversationRepository;
        private readonly IMapper _mapper;

        public ChatConversationsController(IChatConversationRepository chatConversationRepository, IMapper mapper)
        {
            _chatConversationRepository = chatConversationRepository;
            _mapper = mapper;
        }

        // GET: api/ChatConversations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChatConversationReadDto>>> GetAll()
        {
            var conversations = await _chatConversationRepository.GetAllAsync();
            var conversationsDto = _mapper.Map<IEnumerable<ChatConversationReadDto>>(conversations);
            return Ok(conversationsDto);
        }

        // GET: api/ChatConversations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChatConversationReadDto>> GetById(int id)
        {
            var conversation = await _chatConversationRepository.GetByIdAsync(id);
            if (conversation == null) return NotFound();

            var conversationDto = _mapper.Map<ChatConversationReadDto>(conversation);
            return Ok(conversationDto);
        }

        // GET: api/ChatConversations/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ChatConversationReadDto>>> GetByUserId(int userId)
        {
            var conversations = await _chatConversationRepository.GetByUserIdAsync(userId);
            var conversationsDto = _mapper.Map<IEnumerable<ChatConversationReadDto>>(conversations);
            return Ok(conversationsDto);
        }

        // GET: api/ChatConversations/host/5
        [HttpGet("host/{hostId}")]
        public async Task<ActionResult<IEnumerable<ChatConversationReadDto>>> GetByHostId(int hostId)
        {
            var conversations = await _chatConversationRepository.GetByHostIdAsync(hostId);
            var conversationsDto = _mapper.Map<IEnumerable<ChatConversationReadDto>>(conversations);
            return Ok(conversationsDto);
        }

        // GET: api/ChatConversations/room/5
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<IEnumerable<ChatConversationReadDto>>> GetByRoomId(int roomId)
        {
            var conversations = await _chatConversationRepository.GetByRoomIdAsync(roomId);
            var conversationsDto = _mapper.Map<IEnumerable<ChatConversationReadDto>>(conversations);
            return Ok(conversationsDto);
        }

        // POST: api/ChatConversations
        [HttpPost]
        public async Task<ActionResult<ChatConversationReadDto>> Create(ChatConversationCreateDto createDto)
        {
            var conversation = _mapper.Map<ChatConversation>(createDto);

            await _chatConversationRepository.AddAsync(conversation);
            await _chatConversationRepository.SaveChangesAsync();

            var conversationDto = _mapper.Map<ChatConversationReadDto>(conversation);
            return CreatedAtAction(nameof(GetById), new { id = conversation.Conversation_Id }, conversationDto);
        }

        // PUT: api/ChatConversations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ChatConversationUpdateDto updateDto)
        {
            var conversation = await _chatConversationRepository.GetByIdAsync(id);
            if (conversation == null) return NotFound();

            _mapper.Map(updateDto, conversation);

            _chatConversationRepository.Update(conversation);
            await _chatConversationRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ChatConversations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var conversation = await _chatConversationRepository.GetByIdAsync(id);
            if (conversation == null) return NotFound();

            _chatConversationRepository.Remove(conversation);
            await _chatConversationRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
