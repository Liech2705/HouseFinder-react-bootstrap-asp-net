using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.ChatMessageDtos;
using MyApi.Application.DTOs.CheckBookingDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckBookingsController : ControllerBase
    {
        private readonly ICheckBookingRepository _checkBookingRepository;
        private readonly IMapper _mapper;

        public CheckBookingsController(ICheckBookingRepository checkBookingRepository, IMapper mapper)
        {
            _checkBookingRepository = checkBookingRepository;
            _mapper = mapper;
        }

        // GET: api/CheckBookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CheckBookingReadDto>>> GetAll()
        {
            var checks = await _checkBookingRepository.GetAllAsync<CheckBookingReadDto>(_mapper.ConfigurationProvider);
            var checksDto = _mapper.Map<IEnumerable<CheckBookingReadDto>>(checks);
            return Ok(checksDto);
        }

        // GET: api/CheckBookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CheckBookingReadDto>> GetById(int id)
        {
            var check = await _checkBookingRepository.GetByIdAsync(id);
            if (check == null) return NotFound();

            var checkDto = _mapper.Map<CheckBookingReadDto>(check);
            return Ok(checkDto);
        }

        // GET: api/CheckBookings/booking/5
        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<IEnumerable<CheckBookingReadDto>>> GetByBookingId(int bookingId)
        {
            var checks = await _checkBookingRepository.GetByBookingIdAsync(bookingId);
            var checksDto = _mapper.Map<IEnumerable<CheckBookingReadDto>>(checks);
            return Ok(checksDto);
        }

        // GET: api/CheckBookings/type/1
        [HttpGet("type/{checkType}")]
        public async Task<ActionResult<IEnumerable<CheckBookingReadDto>>> GetByType(int checkType)
        {
            var typeEnum = (CheckType)checkType;
            var checks = await _checkBookingRepository.GetByTypeAsync(typeEnum);
            var checksDto = _mapper.Map<IEnumerable<CheckBookingReadDto>>(checks);
            return Ok(checksDto);
        }

        // POST: api/CheckBookings
        [HttpPost]
        public async Task<ActionResult<CheckBookingReadDto>> Create(CheckBookingCreateDto createDto)
        {
            var check = _mapper.Map<CheckBooking>(createDto);

            await _checkBookingRepository.AddAsync(check);
            await _checkBookingRepository.SaveChangesAsync();

            var checkDto = _mapper.Map<CheckBookingReadDto>(check);
            return CreatedAtAction(nameof(GetById), new { id = check.Check_Id }, checkDto);
        }

        // PUT: api/CheckBookings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CheckBookingUpdateDto updateDto)
        {
            var check = await _checkBookingRepository.GetByIdAsync(id);
            if (check == null) return NotFound();

            _mapper.Map(updateDto, check);

            _checkBookingRepository.Update(check);
            await _checkBookingRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/CheckBookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var check = await _checkBookingRepository.GetByIdAsync(id);
            if (check == null) return NotFound();

            _checkBookingRepository.Remove(check);
            await _checkBookingRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
