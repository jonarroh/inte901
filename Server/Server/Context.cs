using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Models.Usuario.Server.Models.Usuario;

namespace Server
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Direcciones> Direcciones { get; set; }

        
    }
}
