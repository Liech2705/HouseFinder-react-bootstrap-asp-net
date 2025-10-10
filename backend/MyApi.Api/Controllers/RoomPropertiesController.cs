using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.RoomPropertyDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomPropertiesController : ControllerBase
    {
        private readonly IRoomPropertyRepository _roomPropertyRepository;
        private readonly IMapper _mapper;

        public RoomPropertiesController(IRoomPropertyRepository roomPropertyRepository, IMapper mapper)
        {
            _roomPropertyRepository = roomPropertyRepository;
            _mapper = mapper;
        }

        // GET: api/RoomProperties/room/5
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<RoomPropertyReadDto>> GetByRoomId(int roomId)
        {
            var property = await _roomPropertyRepository.GetByRoomIdAsync(roomId);
            if (property == null) return NotFound();
            return Ok(_mapper.Map<RoomPropertyReadDto>(property));
        }

        // POST: api/RoomProperties
        [HttpPost]
        public async Task<ActionResult<RoomPropertyReadDto>> Create(RoomPropertyCreateDto createDto)
        {
            var property = _mapper.Map<RoomProperty>(createDto);
            await _roomPropertyRepository.AddAsync(property);
            await _roomPropertyRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByRoomId), new { roomId = property.Room_Id }, _mapper.Map<RoomPropertyReadDto>(property));
        }

        // PUT: api/RoomProperties/5
        [HttpPut("{roomId}")]
        public async Task<IActionResult> Update(int roomId, RoomPropertyUpdateDto updateDto)
        {
            var property = await _roomPropertyRepository.GetByRoomIdAsync(roomId);
            if (property == null) return NotFound();

            _mapper.Map(updateDto, property);
            _roomPropertyRepository.Update(property);
            await _roomPropertyRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/RoomProperties/5
        [HttpDelete("{roomId}")]
        public async Task<IActionResult> Delete(int roomId)
        {
            var property = await _roomPropertyRepository.GetByRoomIdAsync(roomId);
            if (property == null) return NotFound();

            _roomPropertyRepository.Remove(property);
            await _roomPropertyRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
