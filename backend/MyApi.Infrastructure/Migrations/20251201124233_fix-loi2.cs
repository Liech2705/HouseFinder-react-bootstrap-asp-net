using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class fixloi2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Rooms_Room_Id1",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_Room_Id1",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "Room_Id1",
                table: "Reviews");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Room_Id",
                table: "Reviews",
                column: "Room_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Rooms_Room_Id",
                table: "Reviews",
                column: "Room_Id",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Rooms_Room_Id",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_Room_Id",
                table: "Reviews");

            migrationBuilder.AddColumn<int>(
                name: "Room_Id1",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Room_Id1",
                table: "Reviews",
                column: "Room_Id1");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Rooms_Room_Id1",
                table: "Reviews",
                column: "Room_Id1",
                principalTable: "Rooms",
                principalColumn: "Room_Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
