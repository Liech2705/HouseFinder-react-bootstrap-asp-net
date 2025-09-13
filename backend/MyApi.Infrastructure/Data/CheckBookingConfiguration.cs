using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

namespace MyApi.Infrastructure.Configurations
{
    public class CheckBookingConfiguration : IEntityTypeConfiguration<CheckBooking>
    {
        public void Configure(EntityTypeBuilder<CheckBooking> builder)
        {
            // Table name
            builder.ToTable("CheckBookings");

            // Primary key
            builder.HasKey(cb => cb.Check_Id);

            builder.Property(cb => cb.Check_Id)
                   .ValueGeneratedOnAdd();

            // Properties
            builder.Property(cb => cb.Image_Url)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(cb => cb.Check)
                   .HasConversion<string>() // enum -> string
                   .HasMaxLength(50)
                   .HasDefaultValue(CheckType.CheckIn);

            builder.Property(cb => cb.Check_Date)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(cb => cb.Booking)
                   .WithMany(b => b.CheckBookings)
                   .HasForeignKey(cb => cb.Booking_Id)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
