namespace MyApi.Application.DTOs.UserPaymentMethodDtos
{
    // DTO trả dữ liệu ra ngoài cho client
    public class UserPaymentMethodReadDto
    {
        public int Payment_Method_Id { get; set; }
        public int User_Id { get; set; }
        public string? Account_User_Name { get; set; }
        public string? Bank_Account_Number { get; set; }
        public string? Bank_Name { get; set; }
        public bool? Status { get; set; }
        public DateTime? Create_At { get; set; }
    }

    // DTO khi tạo mới phương thức thanh toán
    public class UserPaymentMethodCreateDto
    {
        public int User_Id { get; set; }
        public string? Account_User_Name { get; set; }
        public string? Bank_Account_Number { get; set; }
        public string? Bank_Name { get; set; }
    }

    // DTO khi cập nhật phương thức thanh toán
    public class UserPaymentMethodUpdateDto
    {
        public string? Account_User_Name { get; set; }
        public string? Bank_Account_Number { get; set; }
        public string? Bank_Name { get; set; }
        public bool? Status { get; set; }
    }
}
