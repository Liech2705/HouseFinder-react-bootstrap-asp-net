using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class RoomImageConfiguration : IEntityTypeConfiguration<RoomImage>
    {
        public void Configure(EntityTypeBuilder<RoomImage> builder)
        {
            // Table name
            builder.ToTable("RoomImages");

            // Primary key
            builder.HasKey(ri => ri.Image_Id);

            builder.Property(ri => ri.Image_Id)
                   .ValueGeneratedOnAdd();

            // Properties
            builder.Property(ri => ri.Image_Url)
                   .IsRequired()
                   .HasMaxLength(500); // set giới hạn url ảnh

            builder.Property(ri => ri.Uploaded_At)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(ri => ri.Room)
                   .WithMany(r => r.RoomImages)   // Room có nhiều RoomImage
                   .HasForeignKey(ri => ri.Room_Id)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
