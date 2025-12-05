using MyApi.Application.DTOs.BookingDtos;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Interfaces;

namespace MyApi.Domain.Interfaces
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<IEnumerable<Booking>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Booking>> GetByRoomIdAsync(int roomId);
        Task<int> GetIdByRoomIdAsync(VNPayRequest model);
        Task<bool> CheckBookingByRoomIdAsync(int roomId);
        Task SavePaymentAsync(VnPayResponse res);
        Task<bool> CheckIsPayMent(int user_Id, int room_Id);
        Task<bool> CheckIsBooking(int user_Id, int room_Id);
    }
}
