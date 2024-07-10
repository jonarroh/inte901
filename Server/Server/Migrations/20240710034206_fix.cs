using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class fix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            if (!migrationBuilder.ActiveProvider.Contains("SqlServer"))
            {
                return;
            }

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MateriasPrimas]') AND type in (N'U'))
                BEGIN
                    CREATE TABLE [MateriasPrimas] (
                        [Id] int NOT NULL IDENTITY,
                        [Material] nvarchar(255) NOT NULL,
                        [Estatus] int NOT NULL,
                        [CreatedAt] datetime2 NULL,
                        [UpdatedAt] datetime2 NULL,
                        [DeletedAt] datetime2 NULL,
                        CONSTRAINT [PK_MateriasPrimas] PRIMARY KEY ([Id])
                    );
                END
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MateriasPrimas");
        }
    }
}
