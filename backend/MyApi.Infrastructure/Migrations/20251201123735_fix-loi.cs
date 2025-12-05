using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class fixloi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<int>(
                name: "Room_Id1",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Rooms_Room_Id1",
                table: "Reviews",
                column: "Room_Id1",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Rooms_Room_Id1",
                table: "Reviews");

            migrationBuilder.AlterColumn<int>(
                name: "Room_Id1",
                table: "Reviews",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Room_Id",
                table: "Reviews",
                column: "Room_Id",
                unique: true);

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
    }
}
