using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using MyApi.Application.DTOs.BoardingHouseDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class BoardingHouseRepository : GenericRepository<BoardingHouse>, IBoardingHouseRepository
    {
        private readonly AppDbContext _context;

        public BoardingHouseRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<IEnumerable<BoardingHouseReadDto>> GetAllAsync<BoardingHouseReadDto>(IConfigurationProvider mapperConfig)
        {
            return await _dbSet.Include(h => h.HouseImages).ProjectTo<BoardingHouseReadDto>(mapperConfig).ToListAsync();
        }

        public async Task<IEnumerable<BoardingHouse>> GetByUserIdAsync(int userId)
        {
            return await _context.BoardingHouses
                                 .Where(h => h.User_Id == userId)
                                 .Include(u => u.User)
                                 .ToListAsync();
        }

        public async Task<BoardingHouse> HidenHouseAsync(int houseId)
        {
            var house = await _dbSet.FirstOrDefaultAsync(h =>  h.House_Id == houseId);
            if (house == null) return null;

            house.Status = HouseStatus.hidden;
            _dbSet.Update(house);
            await _context.SaveChangesAsync();
            return house;

        }

        // 1. SỬA KIỂU TRẢ VỀ: Thêm List<...> vì kết quả là danh sách
        public async Task<List<SearchHouseResult>> SearchHouseAsync(string keyword)
        {
            var query = _dbSet.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(h => h.Street.Contains(keyword) || h.House_Name.Contains(keyword) || h.Commune.Contains(keyword));
            }

            // Lọc các nhà có ít nhất 1 phòng trống VÀ phòng đó phải đang hiển thị (visible)
            query = query.Where(h => h.Rooms.Any(r =>
                !_context.Bookings.Any(b => b.Room_Id == r.Room_Id)
                && r.Status == RoomStatus.visible
            ));

            var result = await query.Select(h => new SearchHouseResult
            {
                Id = h.House_Id,
                Name = h.House_Name,

                // (Tùy chọn) Thêm dấu phẩy hoặc khoảng trắng để địa chỉ dễ đọc hơn
                Address = h.Street + ", " + h.Commune,

                // Đếm số phòng trống + visible
                AvailableRoomsCount = h.Rooms.Count(r =>
                    !_context.Bookings.Any(b => b.Room_Id == r.Room_Id)
                    && r.Status == RoomStatus.visible
                ),

                // Lấy giá thấp nhất (Cần thêm điều kiện Status == visible để giá chính xác với những gì khách thấy)
                MinPrice = h.Rooms
                    .Where(r => !_context.Bookings.Any(b => b.Room_Id == r.Room_Id) && r.Status == RoomStatus.visible)
                    .Min(r => (decimal?)r.Price) ?? 0

            }).Take(5).ToListAsync();

            // 2. TRẢ VỀ KẾT QUẢ
            return result;
        }

        public async Task<BoardingHouse> VisibleHouseAsync(int houseId)
        {
            var house = await _dbSet.FirstOrDefaultAsync(h => h.House_Id == houseId);
            if (house == null) return null;
            house.Status = HouseStatus.visible;
            _dbSet.Update(house);
            await _context.SaveChangesAsync();
            return house;
        }
    }
}
