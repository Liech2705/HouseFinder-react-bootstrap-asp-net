using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApi.Infrastructure.Data
{
    public class UserInforConfiguration : IEntityTypeConfiguration<UserInfor>
    {
        public void Configure(EntityTypeBuilder<UserInfor> b)
        {
            // Tên bảng
            b.ToTable("UserInfor");

            // Khóa chính
            b.HasKey(u => u.Infor_Id);

            b.Property(u => u.Infor_Id)
             .ValueGeneratedOnAdd();

            // Mối quan hệ
            b.HasOne(ui => ui.User)
             .WithOne(u => u.UserInfor)
             .HasForeignKey<UserInfor>(ui => ui.User_Id)
             .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
