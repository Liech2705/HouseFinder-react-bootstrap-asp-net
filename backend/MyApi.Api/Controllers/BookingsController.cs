using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.BookingDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly IVnPayService _vnPayService;

        public BookingsController(IBookingRepository bookingRepository, IMapper mapper, IConfiguration config, IVnPayService vnPayService)
        {
            _bookingRepository = bookingRepository;
            _mapper = mapper;
            _config = config;
            _vnPayService = vnPayService;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingReadDto>>> GetAll()
        {
            var bookings = await _bookingRepository.GetAllAsync<BookingReadDto>(_mapper.ConfigurationProvider);
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

        // GET: api/Bookings/my-bookings
        [Authorize]
        [HttpGet("my-bookings")]
        public async Task<ActionResult<IEnumerable<BookingReadDto>>> GetMyBookings()
        {
            var userIdString = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString))
            {
                return Unauthorized();
            }

            if (!int.TryParse(userIdString, out var userId))
            {
                return BadRequest("Invalid user ID format.");
            }

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

        [HttpGet("CheckRoom/{roomId}")]
        public async Task<IActionResult> CheckRoom(int roomId)
        {
            return Ok(await _bookingRepository.CheckBookingByRoomIdAsync(roomId));
        }


        [HttpPost("vnpay/pay")]
        public async Task<IActionResult> CreatePaymentUrlVnpayAsync(VNPayRequest model)
        {
            model.BookingId = await _bookingRepository.GetIdByRoomIdAsync(model);
            if (model.BookingId == -1) return BadRequest();

            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

            return Ok(new { paymentUrl = url });
        }
        [HttpGet("vnpay/return")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            await _bookingRepository.SavePaymentAsync(response);

            string returnUrl = "";

            if (response.Success && response.VnPayResponseCode == "00")
            {
                returnUrl = $"http://localhost:5173/payment-success";
            } else
            {
                returnUrl = $"http://localhost:5173/payment-failed";
            }

            return Redirect(returnUrl);
        }

        [HttpGet("ispayment/{user_Id}/{room_Id}")]
        public async Task<IActionResult> IsPaymentBooking(int user_Id, int room_Id)
        {
            bool isPaymentBooking = await _bookingRepository.CheckIsPayMent(user_Id, room_Id);

            return Ok(isPaymentBooking);
        }
    }
}
