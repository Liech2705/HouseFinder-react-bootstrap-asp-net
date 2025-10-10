using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class ChatConversationConfiguration : IEntityTypeConfiguration<ChatConversation>
    {
        public void Configure(EntityTypeBuilder<ChatConversation> builder)
        {
            builder.ToTable("ChatConversations");
            builder.HasKey(cc => cc.Conversation_Id);

            builder.Property(cc => cc.Conversation_Id).ValueGeneratedOnAdd();
            builder.Property(cc => cc.Last_Message_At).HasDefaultValueSql("GETDATE()");

            // Room
            builder.HasOne(cc => cc.Room)
                   .WithMany(r => r.ChatConversations)
                   .HasForeignKey(cc => cc.Room_Id)
                   .OnDelete(DeleteBehavior.Restrict);

            // User (Renter)
            builder.HasOne(cc => cc.User)
                   .WithMany(u => u.ChatConversations)
                   .HasForeignKey(cc => cc.User_Id)
                   .OnDelete(DeleteBehavior.Restrict);

            // Host
            builder.HasOne(cc => cc.Host)
                   .WithMany(u => u.HostConversations)
                   .HasForeignKey(cc => cc.Host_Id)
                   .OnDelete(DeleteBehavior.Restrict);

            // Messages
            builder.HasMany(cc => cc.ChatMessages)
                   .WithOne(m => m.ChatConversation)
                   .HasForeignKey(m => m.Conversation_Id)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
