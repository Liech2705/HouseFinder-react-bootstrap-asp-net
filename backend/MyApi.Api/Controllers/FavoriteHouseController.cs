using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Infrastructure.Data;
using MyApi.Infrastructure.Interfaces;
using static MyApi.Application.DTOs.FavoriteHouseDTOs;

namespace MyApi.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriteHouseController : ControllerBase
    {
        private readonly IFavoriteHouseRepository _favoriteRepo;
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;

        public FavoriteHouseController(IFavoriteHouseRepository favoriteRepo, IMapper mapper, AppDbContext context)
        {
            _favoriteRepo = favoriteRepo;
            _mapper = mapper;
            _context = context;
        }

        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleFavorite(FavoriteHouseCreateDto dto)
        {
            var existing = await _favoriteRepo.GetByUserAndHouseAsync(dto.User_Id, dto.House_Id, dto.Room_Id);

            if (existing == null)
            {
                var newFav = _mapper.Map<FavoriteHouse>(dto);
                await _favoriteRepo.AddAsync(newFav);
                return Ok("Đã thêm vào danh sách yêu thích.");
            }
            else
            {
                existing.IsFavorite = !existing.IsFavorite;
                _favoriteRepo.Update(existing);
                return Ok(existing.IsFavorite ? "Đã thích lại." : "Đã bỏ thích.");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetFavorites(int userId)
        {
            var favorites = await _favoriteRepo.GetFavoritesByUserAsync(userId);
            var result = _mapper.Map<IEnumerable<FavoriteHouseReadDto>>(favorites);
            return Ok(result);
        }

        // Thêm hoặc gỡ yêu thích
        [HttpPost("{houseId}")]
        public async Task<IActionResult> ToggleFavorite(int houseId, [FromBody] int userId)
        {
            var favorite = await _context.FavoriteHouses
                .FirstOrDefaultAsync(f => f.User_Id == userId && f.House_Id == houseId);

            if (favorite == null)
            {
                favorite = new FavoriteHouse
                {
                    User_Id = userId,
                    House_Id = houseId,
                    IsFavorite = true,
                    Created_At = DateTime.UtcNow
                };
                _context.FavoriteHouses.Add(favorite);
            }
            else
            {
                favorite.IsFavorite = !favorite.IsFavorite;
                _context.FavoriteHouses.Update(favorite);
            }

            await _context.SaveChangesAsync();
            return Ok(favorite);
        }

        // Kiểm tra nhà đã được yêu thích chưa
        [HttpGet("{houseId}/{userId}")]
        public async Task<IActionResult> CheckFavorite(int userId, int houseId)
        {
            var isFav = await _context.FavoriteHouses
                .AnyAsync(f => f.User_Id == userId && f.House_Id == houseId && f.IsFavorite);
            return Ok(isFav);
        }
    }

}
