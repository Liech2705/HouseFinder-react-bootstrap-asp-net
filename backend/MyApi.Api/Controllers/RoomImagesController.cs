using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.RoomImageDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomImagesController : ControllerBase
    {
        private readonly IRoomImageRepository _roomImageRepository;
        private readonly IMapper _mapper;

        public RoomImagesController(IRoomImageRepository roomImageRepository, IMapper mapper)
        {
            _roomImageRepository = roomImageRepository;
            _mapper = mapper;
        }

        // GET: api/RoomImages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomImageReadDto>>> GetAll()
        {
            var images = await _roomImageRepository.GetAllAsync<RoomImageReadDto>(_mapper.ConfigurationProvider);
            return Ok(_mapper.Map<IEnumerable<RoomImageReadDto>>(images));
        }

        // GET: api/RoomImages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomImageReadDto>> GetById(int id)
        {
            var image = await _roomImageRepository.GetByIdAsync(id);
            if (image == null) return NotFound();

            return Ok(_mapper.Map<RoomImageReadDto>(image));
        }

        // GET: api/RoomImages/room/5
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<IEnumerable<RoomImageReadDto>>> GetByRoomId(int roomId)
        {
            var images = await _roomImageRepository.GetByRoomIdAsync(roomId);
            return Ok(_mapper.Map<IEnumerable<RoomImageReadDto>>(images));
        }

        // POST: api/RoomImages
        [HttpPost]
        public async Task<ActionResult<RoomImageReadDto>> Create(RoomImageCreateDto createDto)
        {
            var image = _mapper.Map<RoomImage>(createDto);
            await _roomImageRepository.AddAsync(image);
            await _roomImageRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = image.Image_Id }, _mapper.Map<RoomImageReadDto>(image));
        }

        // PUT: api/RoomImages/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RoomImageUpdateDto updateDto)
        {
            var image = await _roomImageRepository.GetByIdAsync(id);
            if (image == null) return NotFound();

            _mapper.Map(updateDto, image);
            _roomImageRepository.Update(image);
            await _roomImageRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/RoomImages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var image = await _roomImageRepository.GetByIdAsync(id);
            if (image == null) return NotFound();

            _roomImageRepository.Remove(image);
            await _roomImageRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
