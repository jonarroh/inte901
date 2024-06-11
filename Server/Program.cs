using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server;
using Server.models;

var builder = WebApplication.CreateBuilder(args);

// Obtén el entorno actual (Desarrollo o Producción)
var environment = builder.Configuration.GetValue<string>("Environment");

// Configura el DbContext según el entorno
if (environment == "Development")
{
    builder.Services.AddDbContext<Context>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServerConnection")));
}
else if (environment == "Production")
{
    builder.Services.AddDbContext<Context>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSqlConnection")));
}

var app = builder.Build();

app.MapGet("/", () => "Hello World!");


app.MapGet("/populate", async([FromServices] Context dbContext) =>
{
    dbContext.Tests.Add(new Test { Name = "Test 1", Description = "Description 1" });
    dbContext.Tests.Add(new Test { Name = "Test 2", Description = "Description 2" });
    dbContext.Tests.Add(new Test { Name = "Test 3", Description = "Description 3" });
    await dbContext.SaveChangesAsync();
    return Results.Ok("Database populated");
});


app.MapGet("/tests", async (Context dbContext) =>
{
    var tests = await dbContext.Tests.ToListAsync();
    return tests;
});



// Aplicar migraciones automáticamente al iniciar la aplicación
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<Context>();
    dbContext.Database.Migrate();
}

app.Run();
