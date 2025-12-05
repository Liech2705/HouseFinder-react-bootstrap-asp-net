using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class RoomPropertyConfiguration : IEntityTypeConfiguration<RoomProperty>
    {
        public void Configure(EntityTypeBuilder<RoomProperty> builder)
        {
            builder.HasKey(rp => rp.Property_Id);

            builder.Property(rp => rp.Has_AirConditioner)
                .IsRequired();

            builder.Property(rp => rp.Has_Wifi)
                .IsRequired();

            builder.Property(rp => rp.Bed_Count)
                .IsRequired();

            builder.Property(rp => rp.Has_Closet)
                .IsRequired();

            builder.Property(rp => rp.Has_Mezzanine)
                   .IsRequired();
            builder.Property(rp => rp.Has_Fridge)
                   .IsRequired();
            builder.Property(rp => rp.Has_Hot_Water)
                   .IsRequired();
            builder.Property(rp => rp.Has_Window)
                   .IsRequired();
            builder.Property(rp => rp.Has_Pet)
                   .IsRequired();

        builder.Property(rp => rp.Note)
                .HasMaxLength(500);

            builder.Property(rp => rp.Update_At)
                .HasDefaultValueSql("GETDATE()");

            // Quan hệ 1-1 với Room
            builder.HasOne(rp => rp.Room)
                .WithOne(r => r.RoomProperty) // cần thêm RoomProperty trong Room
                .HasForeignKey<RoomProperty>(rp => rp.Room_Id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
