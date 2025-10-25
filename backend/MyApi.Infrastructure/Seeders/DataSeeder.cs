using MyApi.Domain.Entities;
using MyApi.Domain.Enums;
using MyApi.Infrastructure.Data;
using MyApi.Infrastructure.Services;
using System;

namespace MyApi.Infrastructure.Seeders
{
    public static class DataSeeder
    {
        public static void Seed(AppDbContext context, IPasswordHasherService passwordHasher)
        {
            if (!context.Users.Any())
            {
                var users = new List<User>
                {
                    new User { User_Name = "admin", Email = "admin@gmail.com", PasswordHash = passwordHasher.HashPassword("admin"), Role = UserRole.Admin },
                    new User { User_Name = "test", Email = "test@gmail.com", PasswordHash = passwordHasher.HashPassword("123456"), Role = UserRole.User},
                    new User { User_Name = "host", Email = "host@gmail.com", PasswordHash = passwordHasher.HashPassword("123456host"), Role = UserRole.Host},
                };

                context.Users.AddRange(users);
                context.SaveChanges();

                var userInfos = new List<UserInfor>
                {
                    new UserInfor { Phone = "0123456789", User_Id = users[0].User_Id },
                    new UserInfor { Phone = "0987654321", User_Id = users[1].User_Id },
                    new UserInfor { Phone = "0987657321", User_Id = users[2].User_Id },
                };

                context.UserInfors.AddRange(userInfos);
                context.SaveChanges();
            }

            if (!context.BoardingHouses.Any())
            {
                var random = new Random();

                // Danh sách các quận và đường phổ biến tại Cần Thơ
                var communes = new[]
                {
                    new { Commune = "Ninh Kiều", Streets = new[] { "Đường 30/4", "Đường Mậu Thân", "Đường Nguyễn Văn Cừ", "Đường Trần Hưng Đạo" },
                        Lat = 10.035, Lng = 105.785 },
                    new { Commune = "Cái Răng", Streets = new[] { "Đường Phạm Hùng", "Đường Võ Nguyên Giáp", "Đường Hưng Phú" },
                        Lat = 10.004, Lng = 105.757 },
                    new { Commune = "Bình Thủy", Streets = new[] { "Đường Cách Mạng Tháng 8", "Đường Lê Hồng Phong", "Đường Nguyễn Thị Sáu" },
                        Lat = 10.071, Lng = 105.741 },
                    new { Commune = "Ô Môn", Streets = new[] { "Đường 26 Tháng 3", "Đường Trần Phú", "Đường Nguyễn Văn Trỗi" },
                        Lat = 10.103, Lng = 105.640 },
                    new { Commune = "Thốt Nốt", Streets = new[] { "Đường Lê Lợi", "Đường Hòa Bình", "Đường Trần Hưng Đạo" },
                        Lat = 10.251, Lng = 105.533 }
                };

                // Lấy user có role là Host
                var hostUser = context.Users.FirstOrDefault(u => u.Role == UserRole.Host);
                if (hostUser == null)
                {
                    Console.WriteLine("⚠ Không tìm thấy user có Role = Host để gán BoardingHouse.");
                    return;
                }

                var houses = new List<BoardingHouse>();

                for (int i = 1; i <= 10; i++)
                {
                    var area = communes[random.Next(communes.Length)];
                    var street = area.Streets[random.Next(area.Streets.Length)];

                    // Tạo tọa độ ngẫu nhiên xung quanh trung tâm quận
                    double lat = area.Lat + (random.NextDouble() - 0.5) * 0.01; // ±0.005 độ ~ vài trăm mét
                    double lng = area.Lng + (random.NextDouble() - 0.5) * 0.01;

                    var house = new BoardingHouse
                    {
                        User_Id = hostUser.User_Id,
                        House_Name = $"Nhà trọ {i} - {area.Commune}",
                        Description = "Nhà trọ sạch sẽ, an ninh, gần trường học và chợ. Có wifi, camera và chỗ để xe.",
                        Is_Elevator = random.Next(2) == 0 ? false : true,
                        Electric_Cost = 3500 + random.Next(0, 500),
                        Water_Cost = 12000 + random.Next(0, 3000),
                        Province = "Cần Thơ",
                        Commune = area.Commune,
                        Street = street,
                        Latitude = lat,
                        Longitude = lng,
                        Status = HouseStatus.visible,
                        Create_At = DateTime.Now.AddDays(-random.Next(1, 120))
                    };

                    houses.Add(house);
                }

                context.BoardingHouses.AddRange(houses);
                context.SaveChanges();
            }

            // Chỉ seed nếu chưa có phòng nào
            if (!context.Rooms.Any())
            {
                var random = new Random();

                // Lấy user Host
                var hostUser = context.Users.FirstOrDefault(u => u.Role == UserRole.Host);
                if (hostUser == null)
                {
                    Console.WriteLine("⚠ Không tìm thấy user có Role = Host để gán Room.");
                    return;
                }

                // Lấy tất cả BoardingHouse đã có trong DB (chỉ của host)
                var houses = context.BoardingHouses.Where(h => h.User_Id == hostUser.User_Id).ToList();

                if (!houses.Any())
                {
                    Console.WriteLine("⚠ Không có BoardingHouse nào để gán Room.");
                    return;
                }

                var rooms = new List<Room>();

                foreach (var house in houses)
                {
                    // Mỗi nhà trọ có 5 phòng
                    for (int i = 1; i <= 5; i++)
                    {
                        var price = random.Next(800_000, 2_500_000); // Giá thuê từ 800k - 2.5 triệu

                        var room = new Room
                        {
                            Owner_Id = hostUser.User_Id,
                            House_Id = house.House_Id,
                            Title = $"Phòng {i} - {house.House_Name}",
                            Description = $"Phòng {i} rộng rãi, thoáng mát, đầy đủ tiện nghi. Gần {house.Street}, {house.Commune}, {house.Province}.",
                            Address = $"{house.Street}, {house.Commune}, {house.Province}",
                            Price = price,
                            Status = RoomStatus.visible,
                            Created_At = DateTime.Now.AddDays(-random.Next(1, 60))
                        };

                        rooms.Add(room);
                    }
                }

                context.Rooms.AddRange(rooms);
                context.SaveChanges();
            }

            if (!context.RoomProperties.Any())
            {
                var random = new Random();
                var roomProperties = new List<RoomProperty>();
                var rooms = context.Rooms.ToList();

                if (!rooms.Any())
                {
                    Console.WriteLine("⚠ Không có phòng nào để gán RoomProperty.");
                    return;
                }

                string[] notes =
                {
                    "Phòng có view đẹp, thoáng mát.",
                    "Phòng yên tĩnh, phù hợp sinh viên.",
                    "Phòng có toilet riêng, gần chợ.",
                    "Phòng có nội thất cơ bản.",
                    "Phòng rộng, có ban công và cửa sổ."
                };

                foreach (var room in rooms)
                {
                    var property = new RoomProperty
                    {
                        Room_Id = room.Room_Id,
                        Has_AirConditioner = random.Next(2) == 1,
                        Has_Wifi = true,
                        Bed_Count = random.Next(1, 3),
                        Has_Closet = random.Next(2) == 1,
                        Has_Mezzanine = random.Next(2) == 1,
                        Has_Fridge = random.Next(2) == 1,
                        Has_Hot_Water = random.Next(2) == 1,
                        Has_Window = random.Next(2) == 1,
                        Has_Pet = random.Next(2) == 1,
                        Note = notes[random.Next(notes.Length)],
                        Update_At = DateTime.Now.AddDays(-random.Next(1, 30))
                    };

                    roomProperties.Add(property);
                }

                context.RoomProperties.AddRange(roomProperties);
                context.SaveChanges();
            }

            if (!context.Reports.Any())
            {
                var random = new Random();
                var users = context.Users.ToList();
                var houses = context.BoardingHouses.ToList();
                var rooms = context.Rooms.ToList();
                var reviews = context.Reviews.ToList();

                var reports = new List<Report>();

                // Báo cáo người dùng
                reports.Add(new Report
                {
                    Reporter_Id = users[1].User_Id,
                    Reported_Id = users[2].User_Id,
                    Type = ReportType.User,
                    Title = "Người dùng có hành vi spam",
                    Description = "Người này gửi nhiều tin nhắn làm phiền.",
                    Status = ReportStatus.Pending,
                    Created_At = DateTime.Now.AddDays(-3)
                });

                // Báo cáo nhà trọ
                if (houses.Any())
                {
                    reports.Add(new Report
                    {
                        Reporter_Id = users[1].User_Id,
                        Reported_Id = houses[random.Next(houses.Count)].House_Id,
                        Type = ReportType.House,
                        Title = "Nhà trọ không như mô tả",
                        Description = "Phòng nhỏ và không có máy lạnh như hình đăng.",
                        Status = ReportStatus.Reviewed,
                        Created_At = DateTime.Now.AddDays(-7)
                    });
                }

                // Báo cáo bài đánh giá
                if (reviews.Any())
                {
                    reports.Add(new Report
                    {
                        Reporter_Id = users[2].User_Id,
                        Reported_Id = reviews[random.Next(reviews.Count)].Review_Id,
                        Type = ReportType.Review,
                        Title = "Đánh giá không trung thực",
                        Description = "Bình luận sai sự thật và mang tính công kích.",
                        Status = ReportStatus.Resolved,
                        Created_At = DateTime.Now.AddDays(-10)
                    });
                }

                // Báo cáo tin nhắn
                reports.Add(new Report
                {
                    Reporter_Id = users[0].User_Id,
                    Reported_Id = random.Next(1, 100), // Ví dụ id tin nhắn giả lập
                    Type = ReportType.Message,
                    Title = "Tin nhắn xúc phạm",
                    Description = "Người dùng có lời lẽ không phù hợp trong tin nhắn.",
                    Status = ReportStatus.Pending,
                    Created_At = DateTime.Now.AddDays(-15)
                });

                context.Reports.AddRange(reports);
                context.SaveChanges();
            }

        }
    }
}
