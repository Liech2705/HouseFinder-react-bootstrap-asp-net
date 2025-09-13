using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class UserPaymentMethodConfiguration : IEntityTypeConfiguration<UserPaymentMethod>
    {
        public void Configure(EntityTypeBuilder<UserPaymentMethod> builder)
        {
            // Table name
            builder.ToTable("UserPaymentMethods");

            // Primary key
            builder.HasKey(pm => pm.Payment_Method_Id);

            builder.Property(pm => pm.Payment_Method_Id)
                   .ValueGeneratedOnAdd();

            // Properties
            builder.Property(pm => pm.Account_User_Name)
                   .HasMaxLength(255)
                   .IsRequired();

            builder.Property(pm => pm.Bank_Account_Number)
                   .HasMaxLength(255)
                   .IsRequired();

            builder.Property(pm => pm.Bank_Name)
                   .HasMaxLength(255)
                   .IsRequired();

            builder.Property(pm => pm.Status)
                   .HasColumnType("bit")
                   .HasDefaultValue(true);

            builder.Property(pm => pm.Create_At)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(pm => pm.User)
                   .WithMany(u => u.PaymentMethods)
                   .HasForeignKey(pm => pm.User_Id)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(pm => pm.Payments)
                   .WithOne(p => p.UserPaymentMethod)
                   .HasForeignKey(p => p.Method_Id);
        }
    }
}
