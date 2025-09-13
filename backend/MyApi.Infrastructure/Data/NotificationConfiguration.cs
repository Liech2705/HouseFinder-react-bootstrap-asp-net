using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

namespace MyApi.Infrastructure.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            // Table name
            builder.ToTable("Notifications");

            // Primary key
            builder.HasKey(n => n.Notification_Id);

            builder.Property(n => n.Notification_Id)
                   .ValueGeneratedOnAdd();

            // Properties
            builder.Property(n => n.Title)
                   .IsRequired()
                   .HasMaxLength(255);

            builder.Property(n => n.Message)
                   .IsRequired()
                   .HasColumnType("nvarchar(max)");

            builder.Property(n => n.Is_Read)
                   .HasDefaultValue(false);

            builder.Property(n => n.Type)
                   .HasConversion<string>()   // enum -> string
                   .HasMaxLength(50)
                   .HasDefaultValue(NotificationType.General);

            builder.Property(n => n.Create_At)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(n => n.User)
                   .WithMany(u => u.Notifications)
                   .HasForeignKey(n => n.User_Id)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
