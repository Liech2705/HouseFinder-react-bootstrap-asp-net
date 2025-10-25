using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

namespace MyApi.Infrastructure.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // Table name
            builder.ToTable("Users");

            // Primary key
            builder.HasKey(u => u.User_Id);

            // Properties
            builder.Property(u => u.User_Id)
                   .ValueGeneratedOnAdd();

            builder.Property(u => u.User_Name)
                   .HasMaxLength(255)
                   .IsRequired();

            builder.Property(u => u.Email)
                   .HasMaxLength(255)
                   .IsRequired();

            builder.Property(u => u.PasswordHash)
                   .IsRequired();

            builder.Property(u => u.Role)
                   .HasConversion<string>()   // Lưu Enum thành string
                   .HasMaxLength(20)
                   .IsRequired();

            builder.Property(u => u.Reason)
                   .HasMaxLength(255);


            builder.Property(u => u.Created_At)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(u => u.UserInfor)
                   .WithOne(ui => ui.User)
                   .HasForeignKey<UserInfor>(ui => ui.User_Id)
                   .OnDelete(DeleteBehavior.Cascade); // Giữ nguyên, chỉ 1-1

            builder.HasMany(u => u.BoardingHouses)
                   .WithOne(b => b.User)
                   .HasForeignKey(b => b.User_Id)
                   .OnDelete(DeleteBehavior.NoAction); // ⚠️ thêm dòng này

            builder.HasMany(u => u.Rooms)
                   .WithOne(r => r.Owner)
                   .HasForeignKey(r => r.Owner_Id)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(u => u.PaymentMethods)
                   .WithOne(pm => pm.User)
                   .HasForeignKey(pm => pm.User_Id)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(u => u.Bookings)
                   .WithOne(b => b.User)
                   .HasForeignKey(b => b.User_Id)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(u => u.Reviews)
                   .WithOne(r => r.User)
                   .HasForeignKey(r => r.User_Id)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(u => u.Notifications)
                   .WithOne(n => n.User)
                   .HasForeignKey(n => n.User_Id)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(u => u.Reports)
                   .WithOne(r => r.Reporter)
                   .HasForeignKey(r => r.Reporter_Id)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(u => u.chatMessages)
                   .WithOne(cm => cm.User)
                   .HasForeignKey(cm => cm.User_Id)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(u => u.ChatConversations)
                   .WithOne(cc => cc.User)
                   .HasForeignKey(cc => cc.User_Id)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(u => u.HostConversations)
                   .WithOne(cc => cc.Host)
                   .HasForeignKey(cc => cc.Host_Id)
                   .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
