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
                                    .ThenInclude(b => b.RoomImages)
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
            var isbooking = await _dbSet.FirstOrDefaultAsync(b => b.User_Id == model.UserId && b.Room_Id == model.RoomId && b.Amount == model.Amount);
            if (isbooking == null) {
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
            }
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

        public async Task<CheckIsPaymentResponse> CheckIsPayMent(int user_Id, int room_Id)
        {
            // 1. Tìm booking GẦN NHẤT của User này tại Phòng này
            // (Chỉ quan tâm booking của user này thôi, không quét toàn bộ DB)
            var myBooking = await _dbSet
                .Where(b => b.Room_Id == room_Id && b.User_Id == user_Id)
                .OrderByDescending(b => b.Created_At) // Lấy đơn mới nhất
                .FirstOrDefaultAsync();

            // 2. Nếu chưa từng đặt phòng này -> none
            if (myBooking == null)
            {
                return new CheckIsPaymentResponse { result = "none" };
            }

            var today = DateOnly.FromDateTime(DateTime.Now);

            if (myBooking.Check_Out_Date < today)
            {
                if (myBooking.Status == BookingStatus.Confirmed)
                {
                    myBooking.Status = BookingStatus.Pending;
                    myBooking.Check_In_Date = today; // Cân nhắc kỹ dòng này, nó làm sai lệch ngày vào thực tế

                    await _context.SaveChangesAsync(); // Lưu thay đổi
                    return new CheckIsPaymentResponse { result = "pending" };
                }
            }

            // 4. Trả về kết quả dựa trên trạng thái (Confirmed/Pending)
            string res = myBooking.Status == BookingStatus.Confirmed ? "confirmed" : "pending";

            return new CheckIsPaymentResponse { result = res };
        }

         public async Task<CheckIsPaymentResponse> CheckIsPayMentForHost(int room_Id)
        {
            // 1. Tìm booking GẦN NHẤT của User này tại Phòng này
            // (Chỉ quan tâm booking của user này thôi, không quét toàn bộ DB)
            var myBooking = await _dbSet
                .Where(b => b.Room_Id == room_Id)
                .OrderByDescending(b => b.Created_At) // Lấy đơn mới nhất
                .FirstOrDefaultAsync();

            // 2. Nếu chưa từng đặt phòng này -> none
            if (myBooking == null)
            {
                return new CheckIsPaymentResponse { result = "none" };
            }

            var today = DateOnly.FromDateTime(DateTime.Now);

            if (myBooking.Check_Out_Date < today)
            {
                if (myBooking.Status == BookingStatus.Confirmed)
                {
                    myBooking.Status = BookingStatus.Pending;
                    myBooking.Check_In_Date = today; // Cân nhắc kỹ dòng này, nó làm sai lệch ngày vào thực tế

                    await _context.SaveChangesAsync(); // Lưu thay đổi
                    return new CheckIsPaymentResponse { result = "pending" };
                }
            }

            // 4. Trả về kết quả dựa trên trạng thái (Confirmed/Pending)
            string res = myBooking.Status == BookingStatus.Confirmed ? "confirmed" : "pending";

            return new CheckIsPaymentResponse { result = res };
        }
    }
}
