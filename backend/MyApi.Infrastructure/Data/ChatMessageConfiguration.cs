using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class ChatMessageConfiguration : IEntityTypeConfiguration<ChatMessage>
    {
        public void Configure(EntityTypeBuilder<ChatMessage> builder)
        {
            // Table name
            builder.ToTable("ChatMessages");

            // Primary key
            builder.HasKey(cm => cm.Message_Id);

            builder.Property(cm => cm.Message_Id)
                   .ValueGeneratedOnAdd();

            // Properties
            builder.Property(cm => cm.Content)
                   .IsRequired()
                   .HasMaxLength(1000); // giới hạn nội dung tin nhắn

            builder.Property(cm => cm.Timestamp)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(cm => cm.ChatConversation)
                   .WithMany(cc => cc.ChatMessages)
                   .HasForeignKey(cm => cm.Conversation_Id);

            builder.HasOne(cm => cm.User)
                   .WithMany(u => u.chatMessages)
                   .HasForeignKey(cm => cm.User_Id)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
