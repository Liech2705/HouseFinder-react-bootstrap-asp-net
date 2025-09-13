using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class ChatConversationConfiguration : IEntityTypeConfiguration<ChatConversation>
    {
        public void Configure(EntityTypeBuilder<ChatConversation> builder)
        {
            // Table name
            builder.ToTable("ChatConversations");

            // Primary key
            builder.HasKey(cc => cc.Conversation_Id);

            builder.Property(cc => cc.Conversation_Id)
                   .ValueGeneratedOnAdd();

            // Properties
            builder.Property(cc => cc.Last_Message_At)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(cc => cc.Room)
                   .WithMany(r => r.ChatConversations)
                   .HasForeignKey(cc => cc.Room_Id)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cc => cc.User)   // Người thuê
                   .WithMany(u => u.ChatConversations)
                   .HasForeignKey(cc => cc.User_Id)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(cc => cc.Host)   // Chủ nhà
                   .WithMany()              // tránh vòng lặp navigation
                   .HasForeignKey(cc => cc.Host_Id)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(cc => cc.ChatMessages)
                   .WithOne(m => m.ChatConversation)
                   .HasForeignKey(m => m.Conversation_Id)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
