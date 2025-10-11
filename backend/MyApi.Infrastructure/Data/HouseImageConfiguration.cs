using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Data
{
    internal class HouseImageConfiguration : IEntityTypeConfiguration<HouseImage>
    {

        public void Configure(EntityTypeBuilder<HouseImage> builder)
        {
            builder.ToTable(nameof(HouseImage));
            builder.HasKey(hi => hi.House_Image_Id);

            builder.Property(hi => hi.House_Image_Id)
                   .ValueGeneratedOnAdd();

            builder.Property(hi => hi.Image_Url)
                   .HasMaxLength(500);
            
            builder.HasOne(hi => hi.BoardingHouse)
                   .WithMany(h =>  h.HouseImages)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Property(cb => cb.Uploaded_At)
                   .HasDefaultValueSql("GETDATE()");
        }
    }
}
