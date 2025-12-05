using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class rmpayuserandaisbooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_UserPaymentMethods_Method_Id",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Payments_Method_Id",
                table: "Payments");

            migrationBuilder.RenameColumn(
                name: "Method_Id",
                table: "Payments",
                newName: "Method_Paid");

            migrationBuilder.AddColumn<string>(
                name: "IsBooking",
                table: "Rooms",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "Check_Out_Date",
                table: "Bookings",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "Check_In_Date",
                table: "Bookings",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBooking",
                table: "Rooms");

            migrationBuilder.RenameColumn(
                name: "Method_Paid",
                table: "Payments",
                newName: "Method_Id");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "Check_Out_Date",
                table: "Bookings",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "Check_In_Date",
                table: "Bookings",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_Method_Id",
                table: "Payments",
                column: "Method_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_UserPaymentMethods_Method_Id",
                table: "Payments",
                column: "Method_Id",
                principalTable: "UserPaymentMethods",
                principalColumn: "Payment_Method_Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
