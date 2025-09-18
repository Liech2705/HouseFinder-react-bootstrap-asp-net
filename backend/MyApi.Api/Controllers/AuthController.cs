using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyApi.Application.DTOs;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Data;
using MyApi.Infrastructure.Services;
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
        public AuthController(IPasswordHasherService passwordHasher, IConfiguration config, AppDbContext context)
        {
            _passwordHasher = passwordHasher;
            _config = config;
            _context = context;
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

            return Ok(new { success = true, message = "Đăng ký thành công", userId = user.User_Id });

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

            // Tạo JWT Token
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
                signingCredentials: creds
            );

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
                Token = new JwtSecurityTokenHandler().WriteToken(token),
            });
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

            // Redirect về frontend với JWT
            var redirectUrl = $"http://localhost:5173/auth/callback?token={Uri.EscapeDataString(jwt)}";
            return Redirect(redirectUrl);
        }

}
}
