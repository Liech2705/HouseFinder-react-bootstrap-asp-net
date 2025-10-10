using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.ReviewDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IMapper _mapper;

        public ReviewsController(IReviewRepository reviewRepository, IMapper mapper)
        {
            _reviewRepository = reviewRepository;
            _mapper = mapper;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewReadDto>>> GetAll()
        {
            var reviews = await _reviewRepository.GetAllAsync<ReviewReadDto>(_mapper.ConfigurationProvider);
            return Ok(_mapper.Map<IEnumerable<ReviewReadDto>>(reviews));
        }

        // GET: api/Reviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewReadDto>> GetById(int id)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null) return NotFound();

            return Ok(_mapper.Map<ReviewReadDto>(review));
        }

        // GET: api/Reviews/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ReviewReadDto>>> GetByUser(int userId)
        {
            var reviews = await _reviewRepository.GetByUserIdAsync(userId);
            return Ok(_mapper.Map<IEnumerable<ReviewReadDto>>(reviews));
        }

        // GET: api/Reviews/booking/5
        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<IEnumerable<ReviewReadDto>>> GetByBooking(int bookingId)
        {
            var reviews = await _reviewRepository.GetByBookingIdAsync(bookingId);
            return Ok(_mapper.Map<IEnumerable<ReviewReadDto>>(reviews));
        }

        // POST: api/Reviews
        [HttpPost]
        public async Task<ActionResult<ReviewReadDto>> Create(ReviewCreateDto createDto)
        {
            var review = _mapper.Map<Review>(createDto);
            await _reviewRepository.AddAsync(review);
            await _reviewRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = review.Review_Id }, _mapper.Map<ReviewReadDto>(review));
        }

        // PUT: api/Reviews/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ReviewUpdateDto updateDto)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null) return NotFound();

            _mapper.Map(updateDto, review);
            _reviewRepository.Update(review);
            await _reviewRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null) return NotFound();

            _reviewRepository.Remove(review);
            await _reviewRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
