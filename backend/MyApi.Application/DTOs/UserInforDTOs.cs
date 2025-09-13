namespace MyApi.Application.DTOs.UserInforDtos
{
    // Dùng cho POST (thêm mới thông tin user)
    public class UserInforCreateDto
    {
        public int User_Id { get; set; }      // liên kết với User
        public DateTime? Dob { get; set; }
        public string Phone { get; set; }
        public string Avatar { get; set; }
    }

    // Dùng cho PUT/PATCH (cập nhật thông tin user)
    public class UserInforUpdateDto
    {
        public DateTime? Dob { get; set; }
        public string Phone { get; set; }
        public string Avatar { get; set; }
    }

    // Dùng cho GET (trả dữ liệu về client)
    public class UserInforReadDto
    {
        public int Infor_Id { get; set; }
        public int User_Id { get; set; }
        public DateTime? Dob { get; set; }
        public string Phone { get; set; }
        public string Avatar { get; set; }
        public DateTime? Update_At { get; set; }

        // Optional: nếu muốn trả kèm tên user
        public string UserName { get; set; }
    }
}
