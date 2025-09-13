using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.RoomDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IMapper _mapper;

        public RoomsController(IRoomRepository roomRepository, IMapper mapper)
        {
            _roomRepository = roomRepository;
            _mapper = mapper;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomReadDto>>> GetAll()
        {
            var rooms = await _roomRepository.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<RoomReadDto>>(rooms));
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomReadDto>> GetById(int id)
        {
            var room = await _roomRepository.GetByIdAsync(id);
            if (room == null) return NotFound();

            return Ok(_mapper.Map<RoomReadDto>(room));
        }

        // GET: api/Rooms/owner/5
        [HttpGet("owner/{ownerId}")]
        public async Task<ActionResult<IEnumerable<RoomReadDto>>> GetByOwner(int ownerId)
        {
            var rooms = await _roomRepository.GetByOwnerIdAsync(ownerId);
            return Ok(_mapper.Map<IEnumerable<RoomReadDto>>(rooms));
        }

        // GET: api/Rooms/house/5
        [HttpGet("house/{houseId}")]
        public async Task<ActionResult<IEnumerable<RoomReadDto>>> GetByHouse(int houseId)
        {
            var rooms = await _roomRepository.GetByHouseIdAsync(houseId);
            return Ok(_mapper.Map<IEnumerable<RoomReadDto>>(rooms));
        }

        // GET: api/Rooms/status/visible
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<RoomReadDto>>> GetByStatus(RoomStatus status)
        {
            var rooms = await _roomRepository.GetByStatusAsync(status);
            return Ok(_mapper.Map<IEnumerable<RoomReadDto>>(rooms));
        }

        // GET: api/Rooms/search?keyword=abc
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<RoomReadDto>>> Search([FromQuery] string keyword)
        {
            var rooms = await _roomRepository.SearchByTitleOrAddressAsync(keyword);
            return Ok(_mapper.Map<IEnumerable<RoomReadDto>>(rooms));
        }

        // POST: api/Rooms
        [HttpPost]
        public async Task<ActionResult<RoomReadDto>> Create(RoomCreateDto createDto)
        {
            var room = _mapper.Map<Room>(createDto);
            await _roomRepository.AddAsync(room);
            await _roomRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = room.Room_Id }, _mapper.Map<RoomReadDto>(room));
        }

        // PUT: api/Rooms/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RoomUpdateDto updateDto)
        {
            var room = await _roomRepository.GetByIdAsync(id);
            if (room == null) return NotFound();

            _mapper.Map(updateDto, room);
            _roomRepository.Update(room);
            await _roomRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var room = await _roomRepository.GetByIdAsync(id);
            if (room == null) return NotFound();

            _roomRepository.Remove(room);
            await _roomRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
