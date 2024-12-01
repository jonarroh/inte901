using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server;
using Server.Hubs;
using Server.lib;
using System.Text;

// Crear el builder
var builder = WebApplication.CreateBuilder(args);

// Configurar la conexi�n a la base de datos
var environment = builder.Configuration.GetValue<string>("Environment");

if (environment == "D")
{
    builder.Services.AddDbContext<Context>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServerConnection")));
}
else if (environment == "P")
{
    builder.Services.AddDbContext<Context>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServerConnectionProd")));
}

// Registrar servicios
builder.Services.AddSingleton<TokenService>();
builder.Services.AddHttpClient<IHttpCDNService, HttpCDNService>();

// Services
builder.Services.AddScoped<CreditCardService, CreditCardService>();

// Configurar autenticaci�n JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();

// Configurar Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "My API", Version = "v1" });

    var securityScheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    };

    c.AddSecurityDefinition("Bearer", securityScheme);

    var securityRequirement = new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    };

    c.AddSecurityRequirement(securityRequirement);
});

// Registrar otros servicios necesarios
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder => builder.WithOrigins("http://191.101.1.86:5000", "http://191.101.1.86:4200", "http://191.101.1.86:5173", "http://191.101.1.86:3000") // Lista de or�genes permitidos
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials()); // Permite el uso de credenciales
});


// Agregar soporte para SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Middleware de desarrollo y Swagger
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems.Add("syntaxHighlight", false);
        c.DefaultModelExpandDepth(2);
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
    });
}

// Middleware de enrutamiento
app.UseRouting();

// Habilitar CORS antes de la autenticaci�n y autorizaci�n
app.UseCors("AllowSpecificOrigins");

// Middleware de autenticaci�n y autorizaci�n
app.UseAuthentication();
app.UseAuthorization();

// Agregar el middleware de SignalR
app.MapHub<OrderHub>("/orderHub");

// Middleware de puntos finales
app.MapControllers();

app.Run();
