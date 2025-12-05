using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class HouseImageRepository : GenericRepository<HouseImage>, IHouseImageRepository
    {
        private readonly AppDbContext _context;
        private readonly IHostEnvironment _env;

        public HouseImageRepository(AppDbContext context, IHostEnvironment env) : base(context)
        {
            _context = context;
            _env = env;
        }

        public async Task ChangeImagesHouse(int id, IFormFileCollection imageHouses)
        {
            if (imageHouses == null || imageHouses.Count == 0)
                return;
            string nameroom = id.ToString();
            var uploadFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "house", nameroom);
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            // Xử lý từng file ảnh
            foreach (var imageHouse in imageHouses)
            {
                if (imageHouse == null || imageHouse.Length == 0)
                    continue;

                // Lấy phần mở rộng của file
                var fileExtension = Path.GetExtension(imageHouse.FileName);
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageHouse.CopyToAsync(stream);
                }
                // Tạo record mới trong RoomImage table
                var houseImage = new HouseImage
                {
                    House_Id = id,
                    Image_Url = $"/uploads/house/{nameroom}/{fileName}",
                    Uploaded_At = DateTime.Now
                };

                _dbSet.Add(houseImage);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<HouseImage>> GetByHouseIdAsync(int houseId)
        {
            return await _context.HouseImages
                                 .Where(h => h.House_Id == houseId)
                                 .Include(h => h.BoardingHouse)
                                 .ToListAsync();
        }
    }
}
