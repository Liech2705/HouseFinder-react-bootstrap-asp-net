using MailKit;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
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
                        email = user.Email,
                        userName = user.User_Name,
                        role = user.Role,
                    }
                },
                Token = jwt,
            });

        }

        // POST: api/Auth/login
        // ================== LOGIN ==================
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null) return Unauthorized("Sai Email hoặc Password");

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
                        email = user.Email, 
                        userName = user.User_Name, 
                        role = user.Role, 
                    } 
                }, 
                Token = jwt, 
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout([FromBody] string token)
        {
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
            var authScheme = scheme == "Facebook" ? FacebookDefaults.AuthenticationScheme : GoogleDefaults.AuthenticationScheme;

            var authResult = await HttpContext.AuthenticateAsync(authScheme);

            if (!authResult.Succeeded)
                return BadRequest("Không thể xác thực ");

            var claims = authResult.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var picture = claims?.FirstOrDefault(c => c.Type == "picture")?.Value;

            if (string.IsNullOrEmpty(email))
                return BadRequest("Không lấy được email từ " + scheme);

            // ==== CHECK USER TRONG DB ====
            var user = _context.Users.FirstOrDefault(u => u.Email == email);


            // Tạo JWT có chứa email, name, picture
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Email, email ?? ""),
            new Claim(ClaimTypes.Name, name ?? ""),
            new Claim("picture", picture ?? "")
        }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            // Lưu token vào DB

            string? aut = "";
            if (user != null)
            {
                aut = "-re";
                var userToken = new UserToken
                {
                    UserId = user.User_Id,
                    Token = jwt,
                };
                _context.UserTokens.Add(userToken);
                _context.SaveChanges();
            }
            // Redirect về frontend với JWT
            var redirectUrl = $"http://localhost:5173/auth" + aut + $"/callback?token={Uri.EscapeDataString(jwt)}";
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

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

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
