using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class othermigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Espacios",
                columns: table => new
                {
                    idEspacio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    canPersonas = table.Column<int>(type: "int", nullable: false),
                    precio = table.Column<double>(type: "float", nullable: false),
                    estatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Espacios", x => x.idEspacio);
                });

            migrationBuilder.CreateTable(
                name: "DetailReservas",
                columns: table => new
                {
                    idDetailReser = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    horaInicio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    horaFin = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idEspacio = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetailReservas", x => x.idDetailReser);
                    table.ForeignKey(
                        name: "FK_DetailReservas_Espacios_idEspacio",
                        column: x => x.idEspacio,
                        principalTable: "Espacios",
                        principalColumn: "idEspacio",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservas",
                columns: table => new
                {
                    idReserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idDetailReser = table.Column<int>(type: "int", nullable: false),
                    idUsuario = table.Column<int>(type: "int", nullable: false),
                    idCliente = table.Column<int>(type: "int", nullable: false),
                    estatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservas", x => x.idReserva);
                    table.ForeignKey(
                        name: "FK_Reservas_DetailReservas_idDetailReser",
                        column: x => x.idDetailReser,
                        principalTable: "DetailReservas",
                        principalColumn: "idDetailReser",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservas_Users_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DetailReservas_idEspacio",
                table: "DetailReservas",
                column: "idEspacio");

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_idDetailReser",
                table: "Reservas",
                column: "idDetailReser");

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_UsuarioId",
                table: "Reservas",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reservas");

            migrationBuilder.DropTable(
                name: "DetailReservas");

            migrationBuilder.DropTable(
                name: "Espacios");
        }
    }
}
