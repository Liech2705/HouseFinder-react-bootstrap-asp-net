using BCrypt.Net;

namespace MyApi.Infrastructure.Services
{
    public interface IPasswordHasherService
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
    }

    public class PasswordHasherService : IPasswordHasherService
    {
        // Hash password
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Kiểm tra password với hash
        public bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
