using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MyApi.Application.DTOs.BookingDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public BookingRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(int userId)
        {
            return await _context.Bookings
                                 .Where(b => b.User_Id == userId)
                                 .Include(b => b.Room)
                                 .Include(b => b.User)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetByRoomIdAsync(int roomId)
        {
            return await _context.Bookings
                                 .Where(b => b.Room_Id == roomId)
                                 .Include(b => b.Room)
                                 .Include(b => b.User)
                                 .ToListAsync();
        }

        public async Task<bool> CheckBookingByRoomIdAsync(int roomId)
        {
            return await _context.Bookings.AnyAsync(b => b.Room_Id == roomId);
        }

        public async Task<int> GetIdByRoomIdAsync(VNPayRequest model)
        {
            var booking = new Booking
            {
                Room_Id = model.RoomId,
                User_Id = model.UserId,
                Amount = model.Amount,
                Check_In_Date = model.Check_In_Date,
                Check_Out_Date = model.Check_Out_Date
            };

            await _dbSet.AddAsync(booking);
            await _context.SaveChangesAsync();

            var idbooking = _dbSet.FirstOrDefault(b => b.Room_Id == model.RoomId && b.User_Id == model.UserId && b.Check_In_Date == model.Check_In_Date);
            if (idbooking == null) return -1;

            return idbooking.Booking_Id;
        }

        public async Task SavePaymentAsync(VnPayResponse res)
        {
            // Kiểm tra điều kiện đầu vào (Guard Clause)
            var idBooking = await _dbSet.FindAsync(res.BookingId);

            if (idBooking == null) return;

            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.Transaction_Id == res.TransactionId);
            if (payment == null)
            {
                var newpayment = new Payment
                {
                    Booking_Id = res.BookingId, 
                    Transaction_Id = res.TransactionId,
                    Deposit = res.Amount,
                    Method_Paid = res.PaymentMethod == "vnpay" ? MethodPayment.vnpay : res.PaymentMethod == "metamask" ? MethodPayment.metamask : MethodPayment.cod,
                    Status = PaymentStatus.Success,
                };

                await _context.Payments.AddAsync(newpayment);

            } else
            {
                payment.Status = PaymentStatus.Success;
            }

            idBooking.Status = BookingStatus.Confirmed;

            await _context.SaveChangesAsync();
        }

        public async Task<bool> CheckIsPayMent(int user_Id, int room_Id)
        {
            var isPayment = await _dbSet.Where(b => b.User_Id == user_Id && b.Room_Id == room_Id)
                                        .OrderByDescending(b => b.Created_At)
                                        .FirstOrDefaultAsync();
            if (isPayment == null) return false;
            return isPayment.Status == BookingStatus.Confirmed;
        }

        public async Task<bool> CheckIsBooking(int user_Id, int room_Id)
        {
            var isPayment = await _dbSet.Where(b => b.User_Id == user_Id && b.Room_Id == room_Id)
                                        .OrderByDescending(b => b.Created_At)
                                        .FirstOrDefaultAsync();

            if (isPayment == null) return false;

            return true;
        }
    }
}
