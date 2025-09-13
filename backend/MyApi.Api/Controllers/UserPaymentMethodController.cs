using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.UserPaymentMethodDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPaymentMethodController : ControllerBase
    {
        private readonly IUserPaymentMethodRepository _repository;
        private readonly IMapper _mapper;

        public UserPaymentMethodController(IUserPaymentMethodRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/UserPaymentMethod/ByUser/5
        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<IEnumerable<UserPaymentMethodReadDto>>> GetByUserId(int userId)
        {
            var methods = await _repository.GetByUserIdAsync(userId);
            return Ok(_mapper.Map<IEnumerable<UserPaymentMethodReadDto>>(methods));
        }

        // GET: api/UserPaymentMethod/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserPaymentMethodReadDto>> GetById(int id)
        {
            var method = await _repository.GetByIdAsync(id);
            if (method == null) return NotFound();
            return Ok(_mapper.Map<UserPaymentMethodReadDto>(method));
        }

        // POST: api/UserPaymentMethod
        [HttpPost]
        public async Task<ActionResult<UserPaymentMethodReadDto>> Create(UserPaymentMethodCreateDto createDto)
        {
            var method = _mapper.Map<UserPaymentMethod>(createDto);
            await _repository.AddAsync(method);
            await _repository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = method.Payment_Method_Id }, _mapper.Map<UserPaymentMethodReadDto>(method));
        }

        // PUT: api/UserPaymentMethod/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserPaymentMethodUpdateDto updateDto)
        {
            var method = await _repository.GetByIdAsync(id);
            if (method == null) return NotFound();

            _mapper.Map(updateDto, method);
            _repository.Update(method);
            await _repository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/UserPaymentMethod/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var method = await _repository.GetByIdAsync(id);
            if (method == null) return NotFound();

            _repository.Remove(method);
            await _repository.SaveChangesAsync();

            return NoContent();
        }
    }
}
