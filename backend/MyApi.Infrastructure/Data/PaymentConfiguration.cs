using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasKey(p => p.Payment_Id);

            builder.Property(p => p.Amount)
                .IsRequired();

            builder.Property(p => p.Status)
                .HasConversion<string>() // Enum -> string
                .HasMaxLength(50);

            builder.Property(p => p.Paid_At)
                .HasDefaultValueSql("GETDATE()");

            // Quan hệ 1 Booking có nhiều Payment
            builder.HasOne(p => p.Booking)
                .WithMany(b => b.Payments)
                .HasForeignKey(p => p.Booking_Id)
                .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ với UserPaymentMethod
            builder.HasOne(p => p.UserPaymentMethod)
                .WithMany(upm => upm.Payments)
                .HasForeignKey(p => p.Method_Id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
