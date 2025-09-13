using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.BookingDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IMapper _mapper;

        public BookingsController(IBookingRepository bookingRepository, IMapper mapper)
        {
            _bookingRepository = bookingRepository;
            _mapper = mapper;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingReadDto>>> GetAll()
        {
            var bookings = await _bookingRepository.GetAllAsync();
            var bookingsDto = _mapper.Map<IEnumerable<BookingReadDto>>(bookings);
            return Ok(bookingsDto);
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingReadDto>> GetById(int id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null) return NotFound();

            var bookingDto = _mapper.Map<BookingReadDto>(booking);
            return Ok(bookingDto);
        }

        // GET: api/Bookings/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<BookingReadDto>>> GetByUserId(int userId)
        {
            var bookings = await _bookingRepository.GetByUserIdAsync(userId);
            var bookingsDto = _mapper.Map<IEnumerable<BookingReadDto>>(bookings);
            return Ok(bookingsDto);
        }

        // GET: api/Bookings/room/5
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<IEnumerable<BookingReadDto>>> GetByRoomId(int roomId)
        {
            var bookings = await _bookingRepository.GetByRoomIdAsync(roomId);
            var bookingsDto = _mapper.Map<IEnumerable<BookingReadDto>>(bookings);
            return Ok(bookingsDto);
        }

        // POST: api/Bookings
        [HttpPost]
        public async Task<ActionResult<BookingReadDto>> Create(BookingCreateDto createDto)
        {
            var booking = _mapper.Map<Booking>(createDto);

            await _bookingRepository.AddAsync(booking);
            await _bookingRepository.SaveChangesAsync();

            var bookingDto = _mapper.Map<BookingReadDto>(booking);
            return CreatedAtAction(nameof(GetById), new { id = booking.Booking_Id }, bookingDto);
        }

        // PUT: api/Bookings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, BookingUpdateDto updateDto)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null) return NotFound();

            _mapper.Map(updateDto, booking);

            _bookingRepository.Update(booking);
            await _bookingRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null) return NotFound();

            _bookingRepository.Remove(booking);
            await _bookingRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
