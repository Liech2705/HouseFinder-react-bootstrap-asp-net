using Microsoft.AspNetCore.Http;
using MyApi.Application.DTOs.RoomImageDtos;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IRoomImageRepository : IGenericRepository<RoomImage>
    {
        Task<IEnumerable<RoomImage>> GetByRoomIdAsync(int roomId);
        Task ChangeImagesRoom(int id, IFormFileCollection imageRooms);
        Task<bool> DeleteRoomImageAsync(int imageId);
    }
}
