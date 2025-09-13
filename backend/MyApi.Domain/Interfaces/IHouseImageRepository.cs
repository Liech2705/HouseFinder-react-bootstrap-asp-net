using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IHouseImageRepository : IGenericRepository<HouseImage>
    {
        Task<IEnumerable<HouseImage>> GetByHouseIdAsync(int houseId);
    }
}
