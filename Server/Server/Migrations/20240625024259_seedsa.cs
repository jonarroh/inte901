using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class seedsa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTimeOffset(new DateTime(2024, 6, 24, 20, 42, 59, 654, DateTimeKind.Unspecified).AddTicks(312), new TimeSpan(0, -6, 0, 0, 0)));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTimeOffset(new DateTime(2024, 6, 24, 20, 42, 59, 654, DateTimeKind.Unspecified).AddTicks(343), new TimeSpan(0, -6, 0, 0, 0)));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTimeOffset(new DateTime(2024, 6, 24, 20, 42, 21, 550, DateTimeKind.Unspecified).AddTicks(3940), new TimeSpan(0, -6, 0, 0, 0)));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTimeOffset(new DateTime(2024, 6, 24, 20, 42, 21, 550, DateTimeKind.Unspecified).AddTicks(3976), new TimeSpan(0, -6, 0, 0, 0)));
        }
    }
}
