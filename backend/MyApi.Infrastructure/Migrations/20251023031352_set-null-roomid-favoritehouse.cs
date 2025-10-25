using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class setnullroomidfavoritehouse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavoriteHouse_Rooms_Room_Id",
                table: "FavoriteHouse");

            migrationBuilder.AlterColumn<int>(
                name: "Room_Id",
                table: "FavoriteHouse",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_FavoriteHouse_Rooms_Room_Id",
                table: "FavoriteHouse",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavoriteHouse_Rooms_Room_Id",
                table: "FavoriteHouse");

            migrationBuilder.AlterColumn<int>(
                name: "Room_Id",
                table: "FavoriteHouse",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FavoriteHouse_Rooms_Room_Id",
                table: "FavoriteHouse",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
