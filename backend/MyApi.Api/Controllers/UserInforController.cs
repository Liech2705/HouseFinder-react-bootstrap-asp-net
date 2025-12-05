using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.UserInforDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserInforController : ControllerBase
    {
        private readonly IUserInforRepository _userInforRepository;
        private readonly IMapper _mapper;

        public UserInforController(IUserInforRepository userInforRepository, IMapper mapper)
        {
            _userInforRepository = userInforRepository;
            _mapper = mapper;
        }

        // GET: api/UserInfor/5
        [HttpGet("{userId}")]
        public async Task<ActionResult<UserInforReadDto>> GetByUserId(int userId)
        {
            var userInfor = await _userInforRepository.GetByUserIdAsync(userId);
            if (userInfor == null) return NotFound();

            return Ok(_mapper.Map<UserInforReadDto>(userInfor));
        }

        // POST: api/UserInfor
        [HttpPost]
        public async Task<ActionResult<UserInforReadDto>> Create(UserInforCreateDto createDto)
        {
            var userInfor = _mapper.Map<UserInfor>(createDto);

            await _userInforRepository.AddAsync(userInfor);
            await _userInforRepository.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByUserId), new { userId = userInfor.User_Id }, _mapper.Map<UserInforReadDto>(userInfor));
        }

        // PUT: api/UserInfor/5
        [HttpPut("{userId}")]
        public async Task<IActionResult> Update(int userId, [FromForm] UserInforUpdateDto updateDto)
        {
            var userInfor = await _userInforRepository.UpdateUserInfor(updateDto, userId);
            if (userInfor == null) return NotFound();

            return Ok(_mapper.Map<UserInforUpdateDto>(userInfor));
        }

        // DELETE: api/UserInfor/5
        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete(int userId)
        {
            var userInfor = await _userInforRepository.GetByUserIdAsync(userId);
            if (userInfor == null) return NotFound();

            _userInforRepository.Remove(userInfor);
            await _userInforRepository.SaveChangesAsync();

            return NoContent();
        }

    }
}
