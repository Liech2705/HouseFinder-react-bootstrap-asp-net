using MyApi.Application.DTOs.UserInforDtos;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IUserInforRepository : IGenericRepository<UserInfor>
    {
        Task<UserInfor?> GetByUserIdAsync(int userId);
        Task<UserInfor> UpdateUserInfor(UserInforUpdateDto updateDto, int userId);
    }
}
