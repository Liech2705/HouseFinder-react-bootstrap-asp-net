using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class HouseImageConfiguration : IEntityTypeConfiguration<HouseImage>
    {
        public void Configure(EntityTypeBuilder<HouseImage> builder)
        {
            builder.HasKey(hi => hi.House_Image_Id);

            builder.Property(hi => hi.Image_Url)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(hi => hi.Uploaded_At)
                .HasDefaultValueSql("GETDATE()");

            // Quan hệ nhiều ảnh thuộc về 1 BoardingHouse
            builder.HasOne(hi => hi.BoardingHouse)
                .WithMany(bh => bh.HouseImages) // cần thêm ICollection<HouseImage> trong BoardingHouse
                .HasForeignKey(hi => hi.House_Id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
