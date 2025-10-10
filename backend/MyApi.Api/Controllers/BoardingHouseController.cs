using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.BoardingHouseDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoardingHouseController : ControllerBase
    {
        private readonly IBoardingHouseRepository _boardingHouseRepository;
        private readonly IMapper _mapper;

        public BoardingHouseController(
            IBoardingHouseRepository boardingHouseRepository,
            IMapper mapper)
        {
            _boardingHouseRepository = boardingHouseRepository;
            _mapper = mapper;
        }

        // GET: api/BoardingHouse
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var houses = await _boardingHouseRepository.GetAllAsync<BoardingHouseReadDto>(_mapper.ConfigurationProvider);

            return Ok(houses);
        }

        // GET: api/BoardingHouse/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var house = await _boardingHouseRepository.GetByIdAsync(id);
            if (house == null) return NotFound(new { message = "Boarding house not found" });

            return Ok(_mapper.Map<BoardingHouseReadDto>(house));
        }

        // GET: api/BoardingHouse/user/{userId}
        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var houses = await _boardingHouseRepository.GetByUserIdAsync(userId);
            return Ok(_mapper.Map<IEnumerable<BoardingHouseReadDto>>(houses));
        }

        // POST: api/BoardingHouse
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BoardingHouseCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var house = _mapper.Map<BoardingHouse>(dto);
            await _boardingHouseRepository.AddAsync(house);
            await _boardingHouseRepository.SaveChangesAsync();

            var result = _mapper.Map<BoardingHouseReadDto>(house);
            return CreatedAtAction(nameof(GetById), new { id = house.House_Id }, result);
        }

        // PUT: api/BoardingHouse/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] BoardingHouseUpdateDto dto)
        {
            var house = await _boardingHouseRepository.GetByIdAsync(id);
            if (house == null) return NotFound(new { message = "Boarding house not found" });

            _mapper.Map(dto, house); // AutoMapper tự map các field update
            _boardingHouseRepository.Update(house);
            await _boardingHouseRepository.SaveChangesAsync();

            return Ok(_mapper.Map<BoardingHouseReadDto>(house));
        }

        // DELETE: api/BoardingHouse/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var house = await _boardingHouseRepository.GetByIdAsync(id);
            if (house == null) return NotFound(new { message = "Boarding house not found" });

            _boardingHouseRepository.Remove(house);
            await _boardingHouseRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
