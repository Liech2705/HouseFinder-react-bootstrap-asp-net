using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class cascadeforeignkey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatConversations_Rooms_Room_Id",
                table: "ChatConversations");

            migrationBuilder.DropForeignKey(
                name: "FK_FavoriteHouse_Rooms_Room_Id",
                table: "FavoriteHouse");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomImages_Rooms_Room_Id",
                table: "RoomImages");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomProperties_Rooms_Room_Id",
                table: "RoomProperties");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_BoardingHouses_House_Id",
                table: "Rooms");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatConversations_Rooms_Room_Id",
                table: "ChatConversations",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FavoriteHouse_Rooms_Room_Id",
                table: "FavoriteHouse",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomImages_Rooms_Room_Id",
                table: "RoomImages",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomProperties_Rooms_Room_Id",
                table: "RoomProperties",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_BoardingHouses_House_Id",
                table: "Rooms",
                column: "House_Id",
                principalTable: "BoardingHouses",
                principalColumn: "House_Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatConversations_Rooms_Room_Id",
                table: "ChatConversations");

            migrationBuilder.DropForeignKey(
                name: "FK_FavoriteHouse_Rooms_Room_Id",
                table: "FavoriteHouse");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomImages_Rooms_Room_Id",
                table: "RoomImages");

            migrationBuilder.DropForeignKey(
                name: "FK_RoomProperties_Rooms_Room_Id",
                table: "RoomProperties");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_BoardingHouses_House_Id",
                table: "Rooms");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatConversations_Rooms_Room_Id",
                table: "ChatConversations",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FavoriteHouse_Rooms_Room_Id",
                table: "FavoriteHouse",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomImages_Rooms_Room_Id",
                table: "RoomImages",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomProperties_Rooms_Room_Id",
                table: "RoomProperties",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_BoardingHouses_House_Id",
                table: "Rooms",
                column: "House_Id",
                principalTable: "BoardingHouses",
                principalColumn: "House_Id");
        }
    }
}
