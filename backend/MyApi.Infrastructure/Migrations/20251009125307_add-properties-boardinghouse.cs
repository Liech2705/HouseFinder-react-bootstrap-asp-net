using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addpropertiesboardinghouse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Rooms");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "BoardingHouses",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "BoardingHouses",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "BoardingHouses");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "BoardingHouses");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Rooms",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Rooms",
                type: "float",
                nullable: true);
        }
    }
}
