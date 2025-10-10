using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addpropertiesroompro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomProperties_Rooms_RoomId",
                table: "RoomProperties");

            migrationBuilder.RenameColumn(
                name: "UpdateAt",
                table: "RoomProperties",
                newName: "Update_At");

            migrationBuilder.RenameColumn(
                name: "RoomId",
                table: "RoomProperties",
                newName: "Room_Id");

            migrationBuilder.RenameColumn(
                name: "HasWifi",
                table: "RoomProperties",
                newName: "Has_Window");

            migrationBuilder.RenameColumn(
                name: "HasCloset",
                table: "RoomProperties",
                newName: "Has_Wifi");

            migrationBuilder.RenameColumn(
                name: "HasAirConditioner",
                table: "RoomProperties",
                newName: "Has_Pet");

            migrationBuilder.RenameColumn(
                name: "BedCount",
                table: "RoomProperties",
                newName: "Bed_Count");

            migrationBuilder.RenameColumn(
                name: "PropertyId",
                table: "RoomProperties",
                newName: "Property_Id");

            migrationBuilder.RenameIndex(
                name: "IX_RoomProperties_RoomId",
                table: "RoomProperties",
                newName: "IX_RoomProperties_Room_Id");

            migrationBuilder.AddColumn<bool>(
                name: "Has_AirConditioner",
                table: "RoomProperties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Has_Closet",
                table: "RoomProperties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Has_Fridge",
                table: "RoomProperties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Has_Hot_Water",
                table: "RoomProperties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Has_Mezzanine",
                table: "RoomProperties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_RoomProperties_Rooms_Room_Id",
                table: "RoomProperties",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoomProperties_Rooms_Room_Id",
                table: "RoomProperties");

            migrationBuilder.DropColumn(
                name: "Has_AirConditioner",
                table: "RoomProperties");

            migrationBuilder.DropColumn(
                name: "Has_Closet",
                table: "RoomProperties");

            migrationBuilder.DropColumn(
                name: "Has_Fridge",
                table: "RoomProperties");

            migrationBuilder.DropColumn(
                name: "Has_Hot_Water",
                table: "RoomProperties");

            migrationBuilder.DropColumn(
                name: "Has_Mezzanine",
                table: "RoomProperties");

            migrationBuilder.RenameColumn(
                name: "Update_At",
                table: "RoomProperties",
                newName: "UpdateAt");

            migrationBuilder.RenameColumn(
                name: "Room_Id",
                table: "RoomProperties",
                newName: "RoomId");

            migrationBuilder.RenameColumn(
                name: "Has_Window",
                table: "RoomProperties",
                newName: "HasWifi");

            migrationBuilder.RenameColumn(
                name: "Has_Wifi",
                table: "RoomProperties",
                newName: "HasCloset");

            migrationBuilder.RenameColumn(
                name: "Has_Pet",
                table: "RoomProperties",
                newName: "HasAirConditioner");

            migrationBuilder.RenameColumn(
                name: "Bed_Count",
                table: "RoomProperties",
                newName: "BedCount");

            migrationBuilder.RenameColumn(
                name: "Property_Id",
                table: "RoomProperties",
                newName: "PropertyId");

            migrationBuilder.RenameIndex(
                name: "IX_RoomProperties_Room_Id",
                table: "RoomProperties",
                newName: "IX_RoomProperties_RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_RoomProperties_Rooms_RoomId",
                table: "RoomProperties",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
