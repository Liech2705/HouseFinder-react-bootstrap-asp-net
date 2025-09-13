using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.ChatMessageDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatMessagesController : ControllerBase
    {
        private readonly IChatMessageRepository _chatMessageRepository;
        private readonly IMapper _mapper;

        public ChatMessagesController(IChatMessageRepository chatMessageRepository, IMapper mapper)
        {
            _chatMessageRepository = chatMessageRepository;
            _mapper = mapper;
        }

        // GET: api/ChatMessages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChatMessageReadDto>>> GetAll()
        {
            var messages = await _chatMessageRepository.GetAllAsync();
            var messagesDto = _mapper.Map<IEnumerable<ChatMessageReadDto>>(messages);
            return Ok(messagesDto);
        }

        // GET: api/ChatMessages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChatMessageReadDto>> GetById(int id)
        {
            var message = await _chatMessageRepository.GetByIdAsync(id);
            if (message == null) return NotFound();

            var messageDto = _mapper.Map<ChatMessageReadDto>(message);
            return Ok(messageDto);
        }

        // GET: api/ChatMessages/conversation/5
        [HttpGet("conversation/{conversationId}")]
        public async Task<ActionResult<IEnumerable<ChatMessageReadDto>>> GetByConversationId(int conversationId)
        {
            var messages = await _chatMessageRepository.GetByConversationIdAsync(conversationId);
            var messagesDto = _mapper.Map<IEnumerable<ChatMessageReadDto>>(messages);
            return Ok(messagesDto);
        }

        // GET: api/ChatMessages/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ChatMessageReadDto>>> GetByUserId(int userId)
        {
            var messages = await _chatMessageRepository.GetByUserIdAsync(userId);
            var messagesDto = _mapper.Map<IEnumerable<ChatMessageReadDto>>(messages);
            return Ok(messagesDto);
        }

        // POST: api/ChatMessages
        [HttpPost]
        public async Task<ActionResult<ChatMessageReadDto>> Create(ChatMessageCreateDto createDto)
        {
            var message = _mapper.Map<ChatMessage>(createDto);

            await _chatMessageRepository.AddAsync(message);
            await _chatMessageRepository.SaveChangesAsync();

            var messageDto = _mapper.Map<ChatMessageReadDto>(message);
            return CreatedAtAction(nameof(GetById), new { id = message.Message_Id }, messageDto);
        }

        // PUT: api/ChatMessages/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ChatMessageUpdateDto updateDto)
        {
            var message = await _chatMessageRepository.GetByIdAsync(id);
            if (message == null) return NotFound();

            _mapper.Map(updateDto, message);

            _chatMessageRepository.Update(message);
            await _chatMessageRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ChatMessages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var message = await _chatMessageRepository.GetByIdAsync(id);
            if (message == null) return NotFound();

            _chatMessageRepository.Remove(message);
            await _chatMessageRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
