using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.NotificationDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;

        public NotificationsController(INotificationRepository notificationRepository, IMapper mapper)
        {
            _notificationRepository = notificationRepository;
            _mapper = mapper;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationReadDto>>> GetAll()
        {
            var notifications = await _notificationRepository.GetAllAsync();
            var notificationsDto = _mapper.Map<IEnumerable<NotificationReadDto>>(notifications);
            return Ok(notificationsDto);
        }

        // GET: api/Notifications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NotificationReadDto>> GetById(int id)
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            if (notification == null) return NotFound();

            var notificationDto = _mapper.Map<NotificationReadDto>(notification);
            return Ok(notificationDto);
        }

        // GET: api/Notifications/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<NotificationReadDto>>> GetByUserId(int userId)
        {
            var notifications = await _notificationRepository.FindAsync(n => n.User_Id == userId);
            var notificationsDto = _mapper.Map<IEnumerable<NotificationReadDto>>(notifications);
            return Ok(notificationsDto);
        }

        // POST: api/Notifications
        [HttpPost]
        public async Task<ActionResult<NotificationReadDto>> Create(NotificationCreateDto createDto)
        {
            var notification = _mapper.Map<Notification>(createDto);

            await _notificationRepository.AddAsync(notification);
            await _notificationRepository.SaveChangesAsync();

            var notificationDto = _mapper.Map<NotificationReadDto>(notification);
            return CreatedAtAction(nameof(GetById), new { id = notification.Notification_Id }, notificationDto);
        }

        // PUT: api/Notifications/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, NotificationUpdateDto updateDto)
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            if (notification == null) return NotFound();

            _mapper.Map(updateDto, notification);

            _notificationRepository.Update(notification);
            await _notificationRepository.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Notifications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            if (notification == null) return NotFound();

            _notificationRepository.Remove(notification);
            await _notificationRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
