using MyApi.Application.DTOs.BoardingHouseDtos;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IBoardingHouseRepository : IGenericRepository<BoardingHouse>
    {
        // Thêm các method đặc thù riêng cho BoardingHouse (nếu cần)
        Task<IEnumerable<BoardingHouse>> GetByUserIdAsync(int userId);
        Task<BoardingHouse> HidenHouseAsync(int houseId);
        Task<BoardingHouse> VisibleHouseAsync(int houseId);
        Task<List<SearchHouseResult>> SearchHouseAsync(string keyword);
        
    }
}
