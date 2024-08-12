using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class ingredientesEnMenu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetailReservas_Espacios_idEspacio",
                table: "DetailReservas");

            migrationBuilder.DropIndex(
                name: "IX_DetailReservas_idEspacio",
                table: "DetailReservas");

            migrationBuilder.DropColumn(
                name: "idUsuario",
                table: "Reservas");

            migrationBuilder.AddColumn<int>(
                name: "Estatus",
                table: "MateriaPrimaProveedores",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EnMenu",
                table: "Ingredientes",
                type: "bit",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Consumo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdReserva = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consumo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Consumo_Reservas_IdReserva",
                        column: x => x.IdReserva,
                        principalTable: "Reservas",
                        principalColumn: "idReserva",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DetailConsumo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    PriceSingle = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdConsumo = table.Column<int>(type: "int", nullable: false),
                    IdProduct = table.Column<int>(type: "int", nullable: false),
                    ConsumoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetailConsumo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DetailConsumo_Consumo_ConsumoId",
                        column: x => x.ConsumoId,
                        principalTable: "Consumo",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Consumo_IdReserva",
                table: "Consumo",
                column: "IdReserva");

            migrationBuilder.CreateIndex(
                name: "IX_DetailConsumo_ConsumoId",
                table: "DetailConsumo",
                column: "ConsumoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DetailConsumo");

            migrationBuilder.DropTable(
                name: "Consumo");

            migrationBuilder.DropColumn(
                name: "Estatus",
                table: "MateriaPrimaProveedores");

            migrationBuilder.DropColumn(
                name: "EnMenu",
                table: "Ingredientes");

            migrationBuilder.AddColumn<int>(
                name: "idUsuario",
                table: "Reservas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_DetailReservas_idEspacio",
                table: "DetailReservas",
                column: "idEspacio");

            migrationBuilder.AddForeignKey(
                name: "FK_DetailReservas_Espacios_idEspacio",
                table: "DetailReservas",
                column: "idEspacio",
                principalTable: "Espacios",
                principalColumn: "idEspacio",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
