using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.HasKey(r => r.Review_Id);

            builder.Property(r => r.Rating)
                .IsRequired()
                .HasComment("Giá trị từ 1 đến 5");

            builder.Property(r => r.Comment)
                .HasMaxLength(1000);

            builder.Property(r => r.Created_At)
                .HasDefaultValueSql("GETDATE()");

            // Quan hệ với User
            builder.HasOne(r => r.User)
                .WithMany(u => u.Reviews)  // cần ICollection<Review> Reviews trong User
                .HasForeignKey(r => r.User_Id)
                .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ với Booking
            builder.HasOne(r => r.Booking)
                .WithOne(b => b.Review)   // mỗi booking chỉ có 1 review
                .HasForeignKey<Review>(r => r.Booking_Id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
