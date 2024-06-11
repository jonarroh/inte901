
using Microsoft.EntityFrameworkCore;
using Server;

public class Startup
{
    private readonly IConfiguration Configuration;

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        // Obtén el entorno actual (Desarrollo o Producción)
        var environment = Configuration.GetValue<string>("Environment");

        // Configura el DbContext según el entorno
        if (environment == "Development")
        {
            services.AddDbContext<Context>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("SqlServerConnection")));
        }
        else if (environment == "Production")
        {
            services.AddDbContext<Context>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("PostgreSqlConnection")));
        }

        // Otros servicios
        services.AddControllersWithViews();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, Context dbContext)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
        });

        // Aplicar migraciones automáticamente
        dbContext.Database.Migrate();
    }
}
