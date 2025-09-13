using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

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

            builder.Property(r => r.Address)
                   .HasColumnType("nvarchar(max)");

            builder.Property(r => r.Latitude)
                   .HasColumnType("float");

            builder.Property(r => r.Longitude)
                   .HasColumnType("float");

            builder.Property(r => r.Price)
                   .HasColumnType("int");

            builder.Property(r => r.Status)
                   .HasConversion<string>() // enum -> string
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(r => r.Created_At)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(r => r.User)
                   .WithMany(u => u.Rooms)
                   .HasForeignKey(r => r.Owner_Id)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.BoardingHouse)
                   .WithMany(bh => bh.Rooms)
                   .HasForeignKey(r => r.House_Id)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.RoomImages)
                   .WithOne(i => i.Room)
                   .HasForeignKey(r => r.Room_Id)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(r => r.ChatConversations)
                   .WithOne(cc => cc.Room)
                   .HasForeignKey(cc => cc.Room_Id)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
