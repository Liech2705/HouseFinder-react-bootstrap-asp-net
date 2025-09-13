using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class RoomPropertyConfiguration : IEntityTypeConfiguration<RoomProperty>
    {
        public void Configure(EntityTypeBuilder<RoomProperty> builder)
        {
            builder.HasKey(rp => rp.PropertyId);

            builder.Property(rp => rp.HasAirConditioner)
                .IsRequired();

            builder.Property(rp => rp.HasWifi)
                .IsRequired();

            builder.Property(rp => rp.BedCount)
                .IsRequired();

            builder.Property(rp => rp.HasCloset)
                .IsRequired();

            builder.Property(rp => rp.Note)
                .HasMaxLength(500);

            builder.Property(rp => rp.UpdateAt)
                .HasDefaultValueSql("GETDATE()");

            // Quan hệ 1-1 với Room
            builder.HasOne(rp => rp.Room)
                .WithOne(r => r.RoomProperty) // cần thêm RoomProperty trong Room
                .HasForeignKey<RoomProperty>(rp => rp.RoomId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
