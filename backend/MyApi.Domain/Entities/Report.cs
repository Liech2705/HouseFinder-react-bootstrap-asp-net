using MyApi.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace MyApi.Domain.Entities
{
    public class Report
    {
        [Key]
        public int Report_Id { get; set; }
        public int Reporter_Id { get; set; }      // Người báo cáo
        public int Reported_Id { get; set; }  // Người bị báo cáo
        public ReportType Type { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public ReportStatus Status { get; set; } = ReportStatus.Pending;
        public DateTime Created_At { get; set; }

        // Navigation
        public User Reporter { get; set; } = null!;
    }
}
