using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

namespace MyApi.Infrastructure.Configurations
{
    public class ReportConfiguration : IEntityTypeConfiguration<Report>
    {
        public void Configure(EntityTypeBuilder<Report> builder)
        {
            builder.HasKey(r => r.Report_Id);

            builder.Property(r => r.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(r => r.Description)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(r => r.Type)
                .HasConversion<string>() // Lưu enum dưới dạng string
                .IsRequired();

            builder.Property(r => r.Status)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(r => r.Created_At)
                .HasDefaultValueSql("GETDATE()");

            // Quan hệ với User (Reporter)
            builder.HasOne(r => r.Reporter)
                .WithMany(u => u.Reports)  // cần khai báo ICollection<Report> ReportsSent trong User
                .HasForeignKey(r => r.Reporter_Id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
