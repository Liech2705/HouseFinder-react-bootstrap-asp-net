using MyApi.Domain.Enums;

namespace MyApi.Application.DTOs.ReportDtos
{
    // Dùng để trả dữ liệu ra ngoài cho client
    public class ReportReadDto
    {
        public int Report_Id { get; set; }
        public int Reporter_Id { get; set; }
        public string Reporter_Name { get; set; } = string.Empty;
        public int? Reported_Id { get; set; }
        public string? Reported_Title { get; set; } = string.Empty;
        public string? Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime Created_At { get; set; }
    }

    // Dùng khi client tạo báo cáo mới
    public class ReportCreateDto
    {
        public int Reporter_Id { get; set; }     // Người báo cáo
        public int? Reported_Id { get; set; }     // Người bị báo cáo
        public ReportType? Type { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
    }

    // Dùng khi admin cập nhật trạng thái xử lý báo cáo
    public class ReportUpdateDto
    {
        public ReportStatus Status { get; set; }
    }
}
