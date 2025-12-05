using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class fixnew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavoriteHouse_Users_User_Id",
                table: "FavoriteHouse");

            migrationBuilder.AddForeignKey(
                name: "FK_FavoriteHouse_Users_User_Id",
                table: "FavoriteHouse",
                column: "User_Id",
                principalTable: "Users",
                principalColumn: "User_Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavoriteHouse_Users_User_Id",
                table: "FavoriteHouse");

            migrationBuilder.AddForeignKey(
                name: "FK_FavoriteHouse_Users_User_Id",
                table: "FavoriteHouse",
                column: "User_Id",
                principalTable: "Users",
                principalColumn: "User_Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
