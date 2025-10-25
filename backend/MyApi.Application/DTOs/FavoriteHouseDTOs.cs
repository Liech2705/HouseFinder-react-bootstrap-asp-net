
using MyApi.Application.DTOs.BoardingHouseDtos;
using MyApi.Application.DTOs.RoomDtos;

namespace MyApi.Application.DTOs
{
    public class FavoriteHouseDTOs
    {
        // DTO trả dữ liệu ra ngoài
        public class FavoriteHouseReadDto
        {
            public int Favorite_Id { get; set; }
            public int User_Id { get; set; }
            public int House_Id { get; set; }
            public int? Room_Id { get; set; }
            public bool IsFavorite { get; set; }
            public DateTime Created_At { get; set; }

            public BoardingHouseReadDto House { get; set; }
            public RoomReadDto Room { get; set; }
        }

        // DTO khi tạo mới
        public class FavoriteHouseCreateDto
        {
            public int User_Id { get; set; }
            public int House_Id { get; set; }
            public int? Room_Id { get; set; }
        }

        // DTO khi cập nhật trạng thái yêu thích
        public class FavoriteHouseUpdateDto
        {
            public bool IsFavorite { get; set; }
        }
    }
}
