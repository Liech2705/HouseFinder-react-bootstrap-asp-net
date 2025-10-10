using Microsoft.EntityFrameworkCore;
using MyApi.Domain.Entities;
using MyApi.Domain.Enums;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{

    public DbSet<User> Users { get; set; }
    public DbSet<UserInfor> UserInfors { get; set; }
    public DbSet<BoardingHouse> BoardingHouses { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<UserPaymentMethod> UserPaymentMethods { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<ChatConversation> ChatConversations { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<CheckBooking> CheckBookings { get; set; }
    public DbSet<HouseImage> HouseImages { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<RoomImage> RoomImages { get; set; }
    public DbSet<RoomProperty> RoomProperties { get; set; }
    public DbSet<UserToken> UserTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed User
        modelBuilder.Entity<User>().HasData(
            new User { User_Id = 1, User_Name = "admin", Email = "admin@gmail.com", PasswordHash = "admin", Role = UserRole.Admin },
            new User { User_Id = 2, User_Name = "test", Email = "test@gmail.com", PasswordHash = "123456", Role = UserRole.User },
            new User { User_Id = 3, User_Name = "host test", Email = "host@gmail.com", PasswordHash = "123456", Role = UserRole.Host }
        );

        // Seed UserInfor (ví dụ có cột Id, Address, PhoneNumber…)
        modelBuilder.Entity<UserInfor>().HasData(
            new UserInfor { Infor_Id = 1, User_Id = 1, Phone = "0123456789" },
            new UserInfor { Infor_Id = 2, User_Id = 2, Phone = "0987654321" }
        );
    }
}
