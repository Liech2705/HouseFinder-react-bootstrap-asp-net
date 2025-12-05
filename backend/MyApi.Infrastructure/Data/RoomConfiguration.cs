using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            // Table name
            builder.ToTable("Rooms");

            // Primary key
            builder.HasKey(r => r.Room_Id);

            builder.Property(r => r.Room_Id)
                   .ValueGeneratedOnAdd();

            // Properties
            builder.Property(r => r.Title)
                   .HasMaxLength(255)
                   .IsRequired();

            builder.Property(r => r.Description)
                   .HasColumnType("nvarchar(max)");

            builder.Property(r => r.Price)
                   .HasColumnType("int");

            builder.Property(r => r.Status)
                   .HasConversion<string>() // enum -> string
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(r => r.Created_At)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(r => r.Owner)
                   .WithMany(u => u.Rooms)
                   .HasForeignKey(r => r.Owner_Id)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(r => r.BoardingHouse)
                   .WithMany(bh => bh.Rooms)
                   .HasForeignKey(r => r.House_Id)
                   .OnDelete(DeleteBehavior.Cascade); // Giữ nguyên

            builder.HasMany(r => r.RoomImages)
                   .WithOne(i => i.Room)
                   .HasForeignKey(r => r.Room_Id)
                   .OnDelete(DeleteBehavior.Cascade); // ✅ OK

            builder.HasMany(r => r.ChatConversations)
                   .WithOne(cc => cc.Room)
                   .HasForeignKey(cc => cc.Room_Id)
                   .OnDelete(DeleteBehavior.Cascade); // ⚠️ sửa lại dòng này

            builder.HasOne(r => r.RoomProperty)
                   .WithOne(rp => rp.Room)
                   .HasForeignKey<RoomProperty>(rp => rp.Room_Id)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.Reviews)
                   .WithOne(rv => rv.Room)
                   .HasForeignKey(rv => rv.Room_Id)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
