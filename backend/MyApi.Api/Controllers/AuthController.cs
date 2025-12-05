using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyApi.Application.DTOs;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Infrastructure.Data;
using MyApi.Infrastructure.Services;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyApi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IPasswordHasherService _passwordHasher;
        private readonly IConfiguration _config;
        private readonly AppDbContext _context; // DbContext của bạn
        private readonly EmailService _mailService;
        public AuthController(IPasswordHasherService passwordHasher, IConfiguration config, AppDbContext context, EmailService mailService)
        {
            _passwordHasher = passwordHasher;
            _config = config;
            _context = context;
            _mailService = mailService;
        }

        // POST: api/Auth/register
        // ================== REGISTER ==================
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            // Check user tồn tại
            if (_context.Users.Any(u => u.Email == dto.Email))
            {
                return BadRequest("Email đã tồn tại!");
            }

            var user = new User
            {
                User_Name = dto.UserName,
                Email = dto.Email,
                PasswordHash = _passwordHasher.HashPassword(dto.Password),
                Role = dto.Role // mặc định User
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            int newUserId = user.User_Id;

            var userInfor = new UserInfor
            {
                User_Id = newUserId,
                Dob = null,
                Phone = dto.Phone,
                Avatar = "",
                Update_At = DateTime.Now
            };

            _context.UserInfors.Add(userInfor);
            _context.SaveChanges();

            // Generate JWT
            var jwt = GenerateJwtToken(user);

            // Lưu token vào DB
            var userToken = new UserToken
            {
                UserId = user.User_Id,
                Token = jwt,
            };
            _context.UserTokens.Add(userToken);
            _context.SaveChanges();



            return Ok(new 
            { 
                success = true, 
                message = "Đăng ký thành công",
                data = new
                {
                    user = new
                    {
                        id = user.User_Id,
                        email = user.Email, 
                        userName = user.User_Name, 
                        avatar = "",
                        role = user.Role,
                        lock_until = user.Lock_Until

                    }
                },
                token = jwt,
            });

        }

        // POST: api/Auth/login
        // ================== LOGIN ==================
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null) return Unauthorized("Sai Email hoặc Password");

            var userInfor = _context.UserInfors.FirstOrDefault(u => u.User_Id == user.User_Id);

            if (!_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Sai Email hoặc Password");
            }

            // Generate JWT
            var jwt = GenerateJwtToken(user);

            // Lưu token vào DB
            var userToken = new UserToken
            {
                UserId = user.User_Id,
                Token = jwt,
            };
            _context.UserTokens.Add(userToken);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Đăng nhập thành công! Chào mừng " + user.User_Name,
                data = new
                {
                    user = new
                    {
                        id = user.User_Id,
                        email = user.Email,
                        userName = user.User_Name,
                        avatar = userInfor.Avatar,
                        role = user.Role,
                        lock_until = user.Lock_Until

                    }
                },
                token = jwt,
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            var storedToken = _context.UserTokens.FirstOrDefault(t => t.Token == token);
            if (storedToken != null)
            {
                _context.UserTokens.Remove(storedToken);
                _context.SaveChanges();
                return Ok(new { message = "Đăng xuất thành công" });
            }
            return BadRequest("Token không tồn tại");
        }


        // Login Google
        [HttpGet("login-google")]
        public IActionResult LoginGoogle()
        {
            var props = new AuthenticationProperties { RedirectUri = "/api/Auth/external-response?scheme=Google" };
            return Challenge(props, GoogleDefaults.AuthenticationScheme);
        }

        // Login Facebook
        [HttpGet("login-facebook")]
        public IActionResult LoginFacebook()
        {
            var props = new AuthenticationProperties { RedirectUri = "/api/Auth/external-response?scheme=Facebook" };
            return Challenge(props, FacebookDefaults.AuthenticationScheme);
        }

        // Callback chung cho cả Google và Facebook
        [HttpGet("external-response")]
        public async Task<IActionResult> ExternalResponse([FromQuery] string scheme)
        {
            // 1. Authenticate với Cookie tạm để lấy thông tin từ Google/FB
            var authResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authResult.Succeeded)
                return BadRequest("Không thể xác thực từ phía Google/Facebook.");

            var claims = authResult.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email)) return BadRequest("Không lấy được email.");

            // 2. Kiểm tra User trong DB
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            // 3. Xử lý logic tạo mới nếu chưa có (Auto-Register)
            if (user == null)
            {
                user = new User
                {
                    Email = email,
                    User_Name = name ?? "Unknown",
                    PasswordHash = "", // User này không có pass
                    Role = UserRole.User, // Role mặc định
                    Lock_Until = null
                };
                _context.Users.Add(user);
                _context.SaveChanges();

                // Tạo UserInfo dummy để tránh lỗi null sau này
                _context.UserInfors.Add(new UserInfor { User_Id = user.User_Id, Update_At = DateTime.Now });
                _context.SaveChanges();
            }

            // 4. Generate Token (Dùng hàm chung để đảm bảo claim giống hệt Login thường)
            var jwt = GenerateJwtToken(user);

            // 5. Lưu Token vào DB
            var userToken = new UserToken
            {
                UserId = user.User_Id,
                Token = jwt,
            };
            _context.UserTokens.Add(userToken);
            _context.SaveChanges();

            // 6. Xóa Cookie tạm (quan trọng để dọn dẹp)
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            // 7. Redirect về Frontend
            var redirectUrl = $"http://localhost:5173/auth-re/callback?token={Uri.EscapeDataString(jwt)}";
            return Redirect(redirectUrl);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.User_Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        // Biến dùng để quên mật khẩu
        private static readonly ConcurrentDictionary<string, (string Otp, DateTime Expiry)> _otpStore
                            = new ConcurrentDictionary<string, (string, DateTime)>();

        // POST: api/auth/sendOtp
        [HttpPost("sendOtp")]
        public async Task<IActionResult> SendOtp([FromBody] SentOTPDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null) return NotFound("Không tìm thấy email người dùng");

            if (string.IsNullOrEmpty(dto.Email))
                return BadRequest("Email is required.");

            var otp = new Random().Next(100000, 999999).ToString();
            _otpStore[dto.Email] = (otp, DateTime.UtcNow.AddMinutes(5));

            var subject = "Mã OTP của bạn";
            var body = $"<h3>Mã OTP của bạn là: <b>{otp}</b></h3><p>Mã này có thời hạn là 5 phút.</p>";

            await _mailService.SendEmailAsync(dto.Email, subject, body);

            return Ok("Gửi OTP thành công.");
        }

        // POST: api/auth/verifyOtp
        [HttpPost("verifyOtp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            if (!_otpStore.ContainsKey(dto.Email))
                return BadRequest("OTP không tìm thấy. Vui lòng gửi lại!.");

            var (storedOtp, expiry) = _otpStore[dto.Email];

            if (DateTime.UtcNow > expiry)
                return BadRequest("OTP hết hạn.");

            if (storedOtp != dto.Otp)
                return BadRequest("OTP không hợp lệ.");

            return Ok("Xác thực OTP thành công.");
        }

        // POST: api/auth/resetPassword
        [HttpPost("resetPassword")]
        public IActionResult ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (!_otpStore.ContainsKey(dto.Email))
                return BadRequest("Không tìm thấy OTP.");

            var (storedOtp, expiry) = _otpStore[dto.Email];

            if (DateTime.UtcNow > expiry)
                return BadRequest("OTP hết hạn.");

            if (storedOtp != dto.Otp) 
                return BadRequest("OTP không hợp lệ.");

            // ✅ TODO: update mật khẩu trong DB (hash bằng BCrypt)
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null) return NotFound("Không tìm thấy email người dùng");
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            _context.SaveChanges();

            _otpStore.TryRemove(dto.Email, out _);

            return Ok("Password reset successfully.");
        }
    }
}
