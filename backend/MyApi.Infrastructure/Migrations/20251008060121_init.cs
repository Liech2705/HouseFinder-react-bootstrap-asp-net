using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
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
                    Role = table.Column<int>(type: "int", maxLength: 20, nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                    House_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Is_Elevator = table.Column<bool>(type: "bit", nullable: true),
                    Electric_Cost = table.Column<int>(type: "int", nullable: false),
                    Water_Cost = table.Column<int>(type: "int", nullable: false),
                    Province = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Commune = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Street = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Create_At = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoardingHouses", x => x.House_Id);
                    table.ForeignKey(
                        name: "FK_BoardingHouses_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Notification_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Is_Read = table.Column<bool>(type: "bit", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Create_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    User_Id1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Notification_Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_User_Id1",
                        column: x => x.User_Id1,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Report_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Reporter_Id = table.Column<int>(type: "int", nullable: false),
                    Reported_Id = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReporterUser_Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Report_Id);
                    table.ForeignKey(
                        name: "FK_Reports_Users_ReporterUser_Id",
                        column: x => x.ReporterUser_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "UserInfors",
                columns: table => new
                {
                    Infor_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Dob = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Avatar = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Update_At = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserInfors", x => x.Infor_Id);
                    table.ForeignKey(
                        name: "FK_UserInfors_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
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
                    Status = table.Column<bool>(type: "bit", nullable: true),
                    Create_At = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPaymentMethods", x => x.Payment_Method_Id);
                    table.ForeignKey(
                        name: "FK_UserPaymentMethods_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "HouseImages",
                columns: table => new
                {
                    House_Image_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    House_Id = table.Column<int>(type: "int", nullable: false),
                    Image_Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Uploaded_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BoardingHouseHouse_Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HouseImages", x => x.House_Image_Id);
                    table.ForeignKey(
                        name: "FK_HouseImages_BoardingHouses_BoardingHouseHouse_Id",
                        column: x => x.BoardingHouseHouse_Id,
                        principalTable: "BoardingHouses",
                        principalColumn: "House_Id",
                        onDelete: ReferentialAction.NoAction);
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
                    Status = table.Column<int>(type: "int", nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Room_Id);
                    table.ForeignKey(
                        name: "FK_Rooms_BoardingHouses_House_Id",
                        column: x => x.House_Id,
                        principalTable: "BoardingHouses",
                        principalColumn: "House_Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_Rooms_Users_Owner_Id",
                        column: x => x.Owner_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
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
                    Status = table.Column<int>(type: "int", nullable: false),
                    Check_In_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Check_Out_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Room_Id1 = table.Column<int>(type: "int", nullable: false),
                    User_Id1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Booking_Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Rooms_Room_Id1",
                        column: x => x.Room_Id1,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_User_Id1",
                        column: x => x.User_Id1,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
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
                    Last_Message_At = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatConversations", x => x.Conversation_Id);
                    table.ForeignKey(
                        name: "FK_ChatConversations_Rooms_Room_Id",
                        column: x => x.Room_Id,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_ChatConversations_Users_Host_Id",
                        column: x => x.Host_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_ChatConversations_Users_User_Id",
                        column: x => x.User_Id,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "RoomImages",
                columns: table => new
                {
                    Image_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Room_Id = table.Column<int>(type: "int", nullable: false),
                    Image_Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Uploaded_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Room_Id1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomImages", x => x.Image_Id);
                    table.ForeignKey(
                        name: "FK_RoomImages_Rooms_Room_Id1",
                        column: x => x.Room_Id1,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.NoAction);
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
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdateAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomProperties", x => x.PropertyId);
                    table.ForeignKey(
                        name: "FK_RoomProperties_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "CheckBookings",
                columns: table => new
                {
                    Check_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Booking_Id = table.Column<int>(type: "int", nullable: false),
                    Image_Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Check = table.Column<int>(type: "int", nullable: false),
                    Check_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Booking_Id1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckBookings", x => x.Check_Id);
                    table.ForeignKey(
                        name: "FK_CheckBookings_Bookings_Booking_Id1",
                        column: x => x.Booking_Id1,
                        principalTable: "Bookings",
                        principalColumn: "Booking_Id",
                        onDelete: ReferentialAction.NoAction);
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
                    Status = table.Column<int>(type: "int", nullable: false),
                    Paid_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Booking_Id1 = table.Column<int>(type: "int", nullable: false),
                    UserPaymentMethodPayment_Method_Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Payment_Id);
                    table.ForeignKey(
                        name: "FK_Payments_Bookings_Booking_Id1",
                        column: x => x.Booking_Id1,
                        principalTable: "Bookings",
                        principalColumn: "Booking_Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_Payments_UserPaymentMethods_UserPaymentMethodPayment_Method_Id",
                        column: x => x.UserPaymentMethodPayment_Method_Id,
                        principalTable: "UserPaymentMethods",
                        principalColumn: "Payment_Method_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Review_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Booking_Id = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<byte>(type: "tinyint", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false),
                    User_Id1 = table.Column<int>(type: "int", nullable: false),
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
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_Reviews_Rooms_Room_Id",
                        column: x => x.Room_Id,
                        principalTable: "Rooms",
                        principalColumn: "Room_Id");
                    table.ForeignKey(
                        name: "FK_Reviews_Users_User_Id1",
                        column: x => x.User_Id1,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Message_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Conversation_Id = table.Column<int>(type: "int", nullable: false),
                    User_Id = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ChatConversationConversation_Id = table.Column<int>(type: "int", nullable: false),
                    User_Id1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Message_Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_ChatConversations_ChatConversationConversation_Id",
                        column: x => x.ChatConversationConversation_Id,
                        principalTable: "ChatConversations",
                        principalColumn: "Conversation_Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Users_User_Id1",
                        column: x => x.User_Id1,
                        principalTable: "Users",
                        principalColumn: "User_Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "User_Id", "Created_At", "Email", "PasswordHash", "Role", "User_Name" },
                values: new object[,]
                {
                    { 1, null, "admin@gmail.com", "admin", 2, "admin" },
                    { 2, null, "test@gmail.com", "123456", 0, "test" },
                    { 3, null, "host@gmail.com", "123456", 1, "host test" }
                });

            migrationBuilder.InsertData(
                table: "UserInfors",
                columns: new[] { "Infor_Id", "Avatar", "Dob", "Phone", "Update_At", "User_Id" },
                values: new object[,]
                {
                    { 1, null, null, "0123456789", null, 1 },
                    { 2, null, null, "0987654321", null, 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoardingHouses_User_Id",
                table: "BoardingHouses",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_Room_Id1",
                table: "Bookings",
                column: "Room_Id1");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_User_Id1",
                table: "Bookings",
                column: "User_Id1");

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
                name: "IX_ChatMessages_ChatConversationConversation_Id",
                table: "ChatMessages",
                column: "ChatConversationConversation_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_User_Id1",
                table: "ChatMessages",
                column: "User_Id1");

            migrationBuilder.CreateIndex(
                name: "IX_CheckBookings_Booking_Id1",
                table: "CheckBookings",
                column: "Booking_Id1");

            migrationBuilder.CreateIndex(
                name: "IX_HouseImages_BoardingHouseHouse_Id",
                table: "HouseImages",
                column: "BoardingHouseHouse_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_User_Id1",
                table: "Notifications",
                column: "User_Id1");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_Booking_Id1",
                table: "Payments",
                column: "Booking_Id1");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_UserPaymentMethodPayment_Method_Id",
                table: "Payments",
                column: "UserPaymentMethodPayment_Method_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReporterUser_Id",
                table: "Reports",
                column: "ReporterUser_Id");

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
                name: "IX_Reviews_User_Id1",
                table: "Reviews",
                column: "User_Id1");

            migrationBuilder.CreateIndex(
                name: "IX_RoomImages_Room_Id1",
                table: "RoomImages",
                column: "Room_Id1");

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
                name: "IX_UserInfors_User_Id",
                table: "UserInfors",
                column: "User_Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPaymentMethods_User_Id",
                table: "UserPaymentMethods",
                column: "User_Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserTokens_UserId",
                table: "UserTokens",
                column: "UserId");
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
                name: "UserInfors");

            migrationBuilder.DropTable(
                name: "UserTokens");

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
