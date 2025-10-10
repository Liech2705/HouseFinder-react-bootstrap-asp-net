using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyApi.Domain.Entities;

namespace MyApi.Infrastructure.Configurations
{
    public class BoardingHouseConfiguration : IEntityTypeConfiguration<BoardingHouse>
    {
        public void Configure(EntityTypeBuilder<BoardingHouse> builder)
        {
            // Table name
            builder.ToTable("BoardingHouses");

            // Primary key
            builder.HasKey(bh => bh.House_Id);

            builder.Property(bh => bh.House_Id)
                   .ValueGeneratedOnAdd();

            // Properties
            builder.Property(bh => bh.Description)
                   .HasColumnType("nvarchar(max)");

            builder.Property(bh => bh.House_Name)
                   .HasColumnType("nvarchar(max)");

            builder.Property(bh => bh.Is_Elevator)
                   .HasColumnType("bit");
            builder.Property(bh => bh.Electric_Cost)
                   .HasColumnType("int");
            builder.Property(bh => bh.Water_Cost)
                   .HasColumnType("int");
            builder.Property(r => r.Latitude)
                   .HasColumnType("float");

            builder.Property(r => r.Longitude)
                   .HasColumnType("float");
            builder.Property(bh => bh.Province)
                   .HasColumnType("nvarchar(max)");
            builder.Property(bh => bh.Commune)
                   .HasColumnType("nvarchar(max)");

            builder.Property(bh => bh.Street)
                   .HasColumnType("nvarchar(max)");

            builder.Property(bh => bh.Status)
                   .HasConversion<string>() // enum -> string
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(bh => bh.Create_At)
                   .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(bh => bh.User)
                   .WithMany(u => u.BoardingHouses)
                   .HasForeignKey(bh => bh.User_Id);

            builder.HasMany(bh => bh.Rooms)
                   .WithOne(r => r.BoardingHouse)
                   .HasForeignKey(r => r.House_Id);

            builder.HasMany(bh => bh.HouseImages)
                   .WithOne(hi => hi.BoardingHouse)
                   .HasForeignKey(hi => hi.House_Id);
        }
    }
}
