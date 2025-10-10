
using MyApi.Domain.Enums;

namespace MyApi.Application.DTOs
{
    // ================== DTOs ==================
    public class RegisterDto
    {
        public string UserName { get; set; } = "Người dùng";
        public string Email { get; set; } = "Empty@gmail.com";
        public string Password { get; set; } = "matkhau123";
        public string? Phone { get; set; }
        public UserRole Role { get; set; } = UserRole.User;
    }

    public class LoginDto
    {
        public string Email { get; set; } = "Người dùng";
        public string Password { get; set; } = "matkhau123";
    }


    public class UserTokenDto
    {
        public string Token { get; set; } = string.Empty;
    }

    public class SentOTPDto
    {
        public string Email { get; set; }
    }

    public class VerifyOtpDto
    {
        public string Email { get; set; }
        public string Otp { get; set; }
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public string Otp { get; set; }
        public string NewPassword { get; set; }
    }
}
