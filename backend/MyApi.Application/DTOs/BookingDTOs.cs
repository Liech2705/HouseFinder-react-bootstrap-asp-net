using Microsoft.AspNetCore.Mvc;
using MyApi.Application.DTOs.CheckBookingDtos;
using MyApi.Application.DTOs.PaymentDtos;
using MyApi.Application.DTOs.ReviewDtos;
using MyApi.Domain.Enums;

namespace MyApi.Application.DTOs.BookingDtos
{
    // POST: khi user đặt phòng
    public class BookingCreateDto
    {
        public int Room_Id { get; set; }
        public int User_Id { get; set; }
        public long Amount { get; set; }
        public DateOnly? Check_In_Date { get; set; }
        public DateOnly? Check_Out_Date { get; set; }
    }

    // PUT/PATCH: cập nhật trạng thái booking
    public class BookingUpdateDto
    {
        public BookingStatus Status { get; set; }
        public DateOnly? Check_In_Date { get; set; }
        public DateOnly? Check_Out_Date { get; set; }
        public long? Amount { get; set; }
    }

    // GET: trả dữ liệu cho client
    public class BookingReadDto
    {
        public int Booking_Id { get; set; }
        public int Room_Id { get; set; }
        public int User_Id { get; set; }
        public long Amount { get; set; }
        public BookingStatus Status { get; set; }
        public DateOnly? Check_In_Date { get; set; }
        public DateOnly? Check_Out_Date { get; set; }
        public DateTime Created_At { get; set; }

        // Thông tin quan hệ
        public string? RoomTitle { get; set; }      // từ Room.Title
        public string? UserName { get; set; }       // từ User.User_Name
        public string? HouseName { get; set; }      // từ Room.BoardingHouse.Name
        public string? HouseAddress { get; set; }   // từ Room.BoardingHouse.Address
        public ICollection<string> RoomImages { get; set; } = new List<string>(); // từ Room.RoomImages

        public ICollection<PaymentReadDto> Payments { get; set; } = new List<PaymentReadDto>();
        public ICollection<CheckBookingReadDto> CheckBookings { get; set; } = new List<CheckBookingReadDto>();
        public ReviewReadDto Review { get; set; } = new ReviewReadDto();
    }


    public class VNPayRequest
    {
        public int BookingId { get; set; }
        public int RoomId { get; set; }
        public int UserId { get; set; }
        public long Amount { get; set; }
        public DateOnly? Check_In_Date { get; set; }
        public DateOnly? Check_Out_Date { get; set; }
        public string Payment_Method { get; set; }
    }

    public class VnPayResponse
    {
        public string TransactionId { get; set; }
        public int BookingId { get; set; }
        public string PaymentMethod { get; set; }
        public bool Success { get; set; }
        public long Amount { get; set; }
        public string VnPayResponseCode { get; set; }

    }

    public class CheckIsPayMent
    {
        public int RoomId { get; set; }
        public int UserId { get; set; }
    }
}
