using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

namespace MyApi.Infrastructure.Configurations
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            // Table name
            builder.ToTable("Bookings");

            // Primary key
            builder.HasKey(b => b.Booking_Id);

            builder.Property(b => b.Booking_Id)
                   .ValueGeneratedOnAdd();

            // Properties
            builder.Property(b => b.Amount)
                   .IsRequired();

            builder.Property(b => b.Status)
                   .HasConversion<string>() // enum -> string
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(b => b.Check_In_Date)
                   .IsRequired();

            builder.Property(b => b.Check_Out_Date)
                   .IsRequired();

            builder.Property(b => b.Created_At)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(b => b.Room)
                   .WithMany(r => r.Bookings)
                   .HasForeignKey(b => b.Room_Id)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(b => b.User)
                   .WithMany(u => u.Bookings)
                   .HasForeignKey(b => b.User_Id)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(b => b.Payments)
                   .WithOne(p => p.Booking)
                   .HasForeignKey(p => p.Booking_Id);

            builder.HasMany(b => b.CheckBookings)
                   .WithOne(cb => cb.Booking)
                   .HasForeignKey(cb => cb.Booking_Id);

            builder.HasOne(b => b.Review)
                   .WithOne(rv => rv.Booking)
                   .HasForeignKey<Review>(rv => rv.Booking_Id);
        }
    }
}
