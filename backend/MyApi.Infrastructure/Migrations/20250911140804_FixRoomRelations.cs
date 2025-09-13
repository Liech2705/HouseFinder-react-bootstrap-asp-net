using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixRoomRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    User_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.User_Id);
                });

            migrationBuilder.CreateTable(
                name: "BoardingHouses",
                columns: table => new
                {
                    House_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Room_Count = table.Column<int>(type: "int", nullable: true),
                    Is_Elevator = table.Column<bool>(type: "bit", nullable: true),
                    Num_Floors = table.Column<int>(type: "int", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Create_At = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoardingHouses", x => x.House_Id);
                    table.ForeignKey(
                        name: "FK_BoardingHouses_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Notification_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Is_Read = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "General"),
                    Create_At = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Notification_Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Report_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Reporter_Id = table.Column<int>(type: "int", nullable: false),
                    Reported_Id = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Report_Id);
                    table.ForeignKey(
                        name: "FK_Reports_Users_Reporter_Id",
                        column: x => x.Reporter_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserInfor",
                columns: table => new
                {
                    Infor_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Dob = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Update_At = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserInfor", x => x.Infor_Id);
                    table.ForeignKey(
                        name: "FK_UserInfor_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPaymentMethods",
                columns: table => new
                {
                    Payment_Method_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Account_User_Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Bank_Account_Number = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Bank_Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Create_At = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPaymentMethods", x => x.Payment_Method_Id);
                    table.ForeignKey(
                        name: "FK_UserPaymentMethods_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HouseImages",
                columns: table => new
                {
                    House_Image_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    House_Id = table.Column<int>(type: "int", nullable: false),
                    Image_Url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Uploaded_At = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HouseImages", x => x.House_Image_Id);
                    table.ForeignKey(
                        name: "FK_HouseImages_BoardingHouses_House_Id",
                        column: x => x.House_Id,
                        principalTable: "BoardingHouses",
                        principalColumn: "House_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Room_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Owner_Id = table.Column<int>(type: "int", nullable: false),
                    House_Id = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: true),
                    Longitude = table.Column<double>(type: "float", nullable: true),
                    Price = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Room_Id);
                    table.ForeignKey(
                        name: "FK_Rooms_BoardingHouses_House_Id",
                        column: x => x.House_Id,
                        principalTable: "BoardingHouses",
                        principalColumn: "House_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Rooms_Users_Owner_Id",
                        column: x => x.Owner_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Booking_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Room_Id = table.Column<int>(type: "int", nullable: false),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Check_In_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Check_Out_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Booking_Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Rooms_Room_Id",
                        column: x => x.Room_Id,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChatConversations",
                columns: table => new
                {
                    Conversation_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Room_Id = table.Column<int>(type: "int", nullable: false),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Host_Id = table.Column<int>(type: "int", nullable: false),
                    Last_Message_At = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatConversations", x => x.Conversation_Id);
                    table.ForeignKey(
                        name: "FK_ChatConversations_Rooms_Room_Id",
                        column: x => x.Room_Id,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatConversations_Users_Host_Id",
                        column: x => x.Host_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChatConversations_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RoomImages",
                columns: table => new
                {
                    Image_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Room_Id = table.Column<int>(type: "int", nullable: false),
                    Image_Url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Uploaded_At = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomImages", x => x.Image_Id);
                    table.ForeignKey(
                        name: "FK_RoomImages_Rooms_Room_Id",
                        column: x => x.Room_Id,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoomProperties",
                columns: table => new
                {
                    PropertyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    HasAirConditioner = table.Column<bool>(type: "bit", nullable: false),
                    HasWifi = table.Column<bool>(type: "bit", nullable: false),
                    BedCount = table.Column<int>(type: "int", nullable: false),
                    HasCloset = table.Column<bool>(type: "bit", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UpdateAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomProperties", x => x.PropertyId);
                    table.ForeignKey(
                        name: "FK_RoomProperties_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CheckBookings",
                columns: table => new
                {
                    Check_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Booking_Id = table.Column<int>(type: "int", nullable: false),
                    Image_Url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Check = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "CheckIn"),
                    Check_Date = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckBookings", x => x.Check_Id);
                    table.ForeignKey(
                        name: "FK_CheckBookings_Bookings_Booking_Id",
                        column: x => x.Booking_Id,
                        principalTable: "Bookings",
                        principalColumn: "Booking_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Payment_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Booking_Id = table.Column<int>(type: "int", nullable: false),
                    Transaction_Id = table.Column<int>(type: "int", nullable: false),
                    Method_Id = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Paid_At = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Payment_Id);
                    table.ForeignKey(
                        name: "FK_Payments_Bookings_Booking_Id",
                        column: x => x.Booking_Id,
                        principalTable: "Bookings",
                        principalColumn: "Booking_Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Payments_UserPaymentMethods_Method_Id",
                        column: x => x.Method_Id,
                        principalTable: "UserPaymentMethods",
                        principalColumn: "Payment_Method_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Review_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Booking_Id = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<byte>(type: "tinyint", nullable: false, comment: "Giá trị từ 1 đến 5"),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    Room_Id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Review_Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Bookings_Booking_Id",
                        column: x => x.Booking_Id,
                        principalTable: "Bookings",
                        principalColumn: "Booking_Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reviews_Rooms_Room_Id",
                        column: x => x.Room_Id,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id");
                    table.ForeignKey(
                        name: "FK_Reviews_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Message_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Conversation_Id = table.Column<int>(type: "int", nullable: false),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Message_Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_ChatConversations_Conversation_Id",
                        column: x => x.Conversation_Id,
                        principalTable: "ChatConversations",
                        principalColumn: "Conversation_Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoardingHouses_User_Id",
                table: "BoardingHouses",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_Room_Id",
                table: "Bookings",
                column: "Room_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_User_Id",
                table: "Bookings",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatConversations_Host_Id",
                table: "ChatConversations",
                column: "Host_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatConversations_Room_Id",
                table: "ChatConversations",
                column: "Room_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatConversations_User_Id",
                table: "ChatConversations",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_Conversation_Id",
                table: "ChatMessages",
                column: "Conversation_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_User_Id",
                table: "ChatMessages",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_CheckBookings_Booking_Id",
                table: "CheckBookings",
                column: "Booking_Id");

            migrationBuilder.CreateIndex(
                name: "IX_HouseImages_House_Id",
                table: "HouseImages",
                column: "House_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_User_Id",
                table: "Notifications",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_Booking_Id",
                table: "Payments",
                column: "Booking_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_Method_Id",
                table: "Payments",
                column: "Method_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_Reporter_Id",
                table: "Reports",
                column: "Reporter_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Booking_Id",
                table: "Reviews",
                column: "Booking_Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Room_Id",
                table: "Reviews",
                column: "Room_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_User_Id",
                table: "Reviews",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_RoomImages_Room_Id",
                table: "RoomImages",
                column: "Room_Id");

            migrationBuilder.CreateIndex(
                name: "IX_RoomProperties_RoomId",
                table: "RoomProperties",
                column: "RoomId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_House_Id",
                table: "Rooms",
                column: "House_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_Owner_Id",
                table: "Rooms",
                column: "Owner_Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserInfor_User_Id",
                table: "UserInfor",
                column: "User_Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPaymentMethods_User_Id",
                table: "UserPaymentMethods",
                column: "User_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "CheckBookings");

            migrationBuilder.DropTable(
                name: "HouseImages");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "RoomImages");

            migrationBuilder.DropTable(
                name: "RoomProperties");

            migrationBuilder.DropTable(
                name: "UserInfor");

            migrationBuilder.DropTable(
                name: "ChatConversations");

            migrationBuilder.DropTable(
                name: "UserPaymentMethods");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "BoardingHouses");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
