using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using MyApi.Application.DTOs.RoomImageDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class RoomImageRepository : GenericRepository<RoomImage>, IRoomImageRepository
    {
        private readonly IHostEnvironment _env;
        private readonly AppDbContext _context;

        public RoomImageRepository(AppDbContext context, IHostEnvironment env) : base(context)
        {
            _context = context;
            _env = env;
        }

        public async Task<IEnumerable<RoomImage>> GetByRoomIdAsync(int roomId)
        {
            return await _context.RoomImages
                .Where(img => img.Room_Id == roomId)
                .ToListAsync();
        }

        public async Task ChangeImagesRoom(int id, IFormFileCollection imageRooms)
        {
            if (imageRooms == null || imageRooms.Count == 0)
                return;
            string nameroom = id.ToString();
            var uploadFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "rooms", nameroom);
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            // Xử lý từng file ảnh
            foreach (var imageRoom in imageRooms)
            {
                if (imageRoom == null || imageRoom.Length == 0)
                    continue;

                // Lấy phần mở rộng của file
                var fileExtension = Path.GetExtension(imageRoom.FileName);
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageRoom.CopyToAsync(stream);
                }
                // Tạo record mới trong RoomImage table
                var roomImage = new RoomImage
                {
                    Room_Id = id,
                    Image_Url = $"/uploads/rooms/{nameroom}/{fileName}",
                    Uploaded_At = DateTime.Now
                };

                _dbSet.Add(roomImage);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteRoomImageAsync(int imageId)
        {
            var roomImage = await _dbSet.FindAsync(imageId);
            
            if (roomImage == null) return false;

            // Optional: verify owner / permission here
            // if (roomImage.Room.Owner_Id != currentUserId) throw new UnauthorizedAccessException();

            // Build absolute file path (Image_Url stored like "/uploads/avatars/xxx.jpg")
            var relativePath = roomImage.Image_Url?.TrimStart('/') ?? string.Empty;

            // Security check: allow only files under uploads folder
            if (!relativePath.StartsWith("uploads/"))
            {
                // don't delete unknown paths; proceed to only remove DB record if you insist
            }
            else
            {
                var filePath = Path.Combine(_env.ContentRootPath, "wwwroot", relativePath.Replace('/', Path.DirectorySeparatorChar));
                if (System.IO.File.Exists(filePath))
                {
                    try
                    {
                        System.IO.File.Delete(filePath);
                    }
                    catch (Exception ex)
                    {
                        throw new Exception($"Cannot delete file: {filePath}", ex);
                    }
                }
            }

            _dbSet.Remove(roomImage);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
