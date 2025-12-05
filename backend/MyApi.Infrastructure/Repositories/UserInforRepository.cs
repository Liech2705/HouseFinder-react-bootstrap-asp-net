using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using MyApi.Application.DTOs.UserInforDtos;
using MyApi.Domain.Entities;
using MyApi.Domain.Interfaces;
using MyApi.Infrastructure.Data;

namespace MyApi.Infrastructure.Repositories
{
    public class UserInforRepository : GenericRepository<UserInfor>, IUserInforRepository
    {
        private readonly AppDbContext _context;
        private readonly IHostEnvironment _env;
        private readonly IMapper _mapper;

        public UserInforRepository(AppDbContext context, IHostEnvironment env, IMapper mapper) : base(context)
        {
            _context = context;
            _env = env;
            _mapper = mapper;
        }

        public async Task<UserInfor?> GetByUserIdAsync(int userId)
        {
            return await _context.UserInfors
                .FirstOrDefaultAsync(ui => ui.User_Id == userId);
        }

        public async Task<UserInfor> UpdateUserInfor(UserInforUpdateDto dto, int userId)
        {
            var userInfor = await _dbSet.FirstOrDefaultAsync(ui => ui.User_Id == userId && ui.Infor_Id == dto.Infor_Id);
            if (userInfor == null) return null;

            bool isUpdated = false;

            // ✅ Xử lý file ảnh (nếu có)
            if (dto.AvatarFile != null && dto.AvatarFile.Length > 0)
            {
                var uploadFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "avatars");
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                // Lấy phần mở rộng của file gốc (ví dụ: .png, .jpg)
                var fileExtension = Path.GetExtension(dto.AvatarFile.FileName);

                // Tạo tên file mới, duy nhất bằng Guid
                var fileName = $"{Guid.NewGuid()}{fileExtension}";

                var filePath = Path.Combine(uploadFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.AvatarFile.CopyToAsync(stream);
                }

                // Xóa avatar cũ nếu có
                if (!string.IsNullOrEmpty(userInfor.Avatar))
                {
                    var oldPath = Path.Combine(_env.ContentRootPath, userInfor.Avatar.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                // Cập nhật đường dẫn avatar mới
                dto.Avatar = $"/uploads/avatars/{fileName}";
                isUpdated = true;
            }

            // ✅ Dùng AutoMapper để map các trường không null
            _mapper.Map(dto, userInfor);

            // ✅ Nếu có thay đổi thì cập nhật thời gian
            if (_context.ChangeTracker.HasChanges())
            {
                userInfor.Update_At = DateTime.UtcNow;
                isUpdated = true;
            }

            // ✅ Cập nhật UserName nếu có
            var user = await _context.Users.FirstOrDefaultAsync(u => u.User_Id == userId);
            if (user != null && !string.IsNullOrEmpty(dto.userName) && user.User_Name != dto.userName)
            {
                user.User_Name = dto.userName;
                isUpdated = true;
            }

            if (isUpdated)
                await _context.SaveChangesAsync();

            return userInfor;
        }

    }
}
