using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.UserDtos;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Services; // chứa logic hash password

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPasswordHasherService _passwordHasher; // service hash password

        public UsersController(IUserRepository userRepository, IMapper mapper, IPasswordHasherService passwordHasher)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<UserReadDto>> GetAll()
        {
            var user = await _userRepository.GetAllAsync<UserReadDto>(_mapper.ConfigurationProvider);

            return Ok(user);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserReadDto>> GetById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return NotFound();

            return Ok(_mapper.Map<UserReadDto>(user));
        }

        // GET: api/Users/email/example@mail.com
        [HttpGet("email/{email}")]
        public async Task<ActionResult<UserReadDto>> GetByEmail(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return NotFound();

            return Ok(_mapper.Map<UserReadDto>(user));
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserUpdateDto updateDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return NotFound();

            // Hash password nếu client gửi
            if (!string.IsNullOrEmpty(updateDto.Password))
                user.PasswordHash = _passwordHasher.HashPassword(updateDto.Password);

            _mapper.Map(updateDto, user);
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return NotFound();

            _userRepository.Remove(user);
            await _userRepository.SaveChangesAsync();

            return NoContent();
        }

        //[Authorize(Roles = "Admin")]
        [HttpPut("locked/{id}")]
        public async Task<IActionResult> Lock(int id,[FromBody] LockedUser lockedDto)
        {
            var user = await _userRepository.LockedAsync(id, lockedDto.Lock_Until, lockedDto.Reason);
            if (user == null) return NotFound(new { message = "user not found" });

            return Ok(_mapper.Map<LockedUser>(user));
        }

        //[Authorize(Roles = "Admin")]
        [HttpPut("unlock/{id}")]
        public async Task<IActionResult> UnLock(int id, [FromBody] UnlockUser unlockedDto)
        {
            var user = await _userRepository.UnLockAsync(id, unlockedDto.Reason);
            if (user == null) return NotFound(new { message = "user not found" });

            return Ok(_mapper.Map<LockedUser>(user));
        }
    }
}
