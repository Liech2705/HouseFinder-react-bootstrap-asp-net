using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class changebookingidroomid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Bookings_Booking_Id",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Rooms_Room_Id",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_Booking_Id",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_Room_Id",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "Booking_Id",
                table: "Reviews");

            migrationBuilder.AlterColumn<int>(
                name: "Room_Id",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Room_Id1",
                table: "Reviews",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Room_Id",
                table: "Reviews",
                column: "Room_Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Room_Id1",
                table: "Reviews",
                column: "Room_Id1");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Bookings_Room_Id",
                table: "Reviews",
                column: "Room_Id",
                principalTable: "Bookings",
                principalColumn: "Booking_Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Rooms_Room_Id1",
                table: "Reviews",
                column: "Room_Id1",
                principalTable: "Rooms",
                principalColumn: "Room_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Bookings_Room_Id",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Rooms_Room_Id1",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_Room_Id",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_Room_Id1",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "Room_Id1",
                table: "Reviews");

            migrationBuilder.AlterColumn<int>(
                name: "Room_Id",
                table: "Reviews",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Booking_Id",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Booking_Id",
                table: "Reviews",
                column: "Booking_Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Room_Id",
                table: "Reviews",
                column: "Room_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Bookings_Booking_Id",
                table: "Reviews",
                column: "Booking_Id",
                principalTable: "Bookings",
                principalColumn: "Booking_Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Rooms_Room_Id",
                table: "Reviews",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id");
        }
    }
}
