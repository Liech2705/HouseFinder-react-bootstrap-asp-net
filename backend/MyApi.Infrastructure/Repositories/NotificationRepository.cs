using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Data;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Infrastructure.Repositories
{
    public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId)
        {
            return await _context.Notifications
                                 .Where(n => n.User_Id == userId)
                                 .OrderByDescending(n => n.Create_At)
                                 .ToListAsync();
        }

        public async Task MarkAsReadAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification != null)
            {
                notification.Is_Read = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}
