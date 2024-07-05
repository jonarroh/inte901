using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class creditCard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MateriaPrimaProveedores_Proveedores_IdUsuario",
                table: "MateriaPrimaProveedores");

            migrationBuilder.DropIndex(
                name: "IX_MateriaPrimaProveedores_IdUsuario",
                table: "MateriaPrimaProveedores");

            migrationBuilder.DropColumn(
                name: "IdUsuario",
                table: "MateriaPrimaProveedores");

            migrationBuilder.CreateIndex(
                name: "IX_Proveedores_IdUsuario",
                table: "Proveedores",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_InventarioMPs_IdCompra",
                table: "InventarioMPs",
                column: "IdCompra");

            migrationBuilder.AddForeignKey(
                name: "FK_InventarioMPs_Purchases_IdCompra",
                table: "InventarioMPs",
                column: "IdCompra",
                principalTable: "Purchases",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Proveedores_Users_IdUsuario",
                table: "Proveedores",
                column: "IdUsuario",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventarioMPs_Purchases_IdCompra",
                table: "InventarioMPs");

            migrationBuilder.DropForeignKey(
                name: "FK_Proveedores_Users_IdUsuario",
                table: "Proveedores");

            migrationBuilder.DropIndex(
                name: "IX_Proveedores_IdUsuario",
                table: "Proveedores");

            migrationBuilder.DropIndex(
                name: "IX_InventarioMPs_IdCompra",
                table: "InventarioMPs");

            migrationBuilder.AddColumn<int>(
                name: "IdUsuario",
                table: "MateriaPrimaProveedores",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MateriaPrimaProveedores_IdUsuario",
                table: "MateriaPrimaProveedores",
                column: "IdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_MateriaPrimaProveedores_Proveedores_IdUsuario",
                table: "MateriaPrimaProveedores",
                column: "IdUsuario",
                principalTable: "Proveedores",
                principalColumn: "Id");
        }
    }
}
