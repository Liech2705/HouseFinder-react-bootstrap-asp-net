using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Data
{
    public class FavoriteHouseConfiguration : IEntityTypeConfiguration<FavoriteHouse>
    {
        public void Configure(EntityTypeBuilder<FavoriteHouse> builder)
        {
            builder.ToTable(nameof(FavoriteHouse));

            builder.HasKey(fh => fh.Favorite_Id);

            builder.Property(fh => fh.Favorite_Id)
                   .ValueGeneratedOnAdd();

            builder.HasOne(fh => fh.User)
                   .WithMany(u => u.FavoriteHouses)
                   .HasForeignKey(fh => fh.User_Id)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(fh => fh.BoardingHouse)
                   .WithMany(h => h.FavoriteHouses)
                   .HasForeignKey(fh => fh.House_Id)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(fh => fh.Room)
                   .WithMany(r => r.FavoriteHouse)
                   .HasForeignKey(fh => fh.Room_Id)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
