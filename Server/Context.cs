using Microsoft.EntityFrameworkCore;
using Server.models;

namespace Server
{
    public class Context(DbContextOptions<Context> options) : DbContext(options)
    {
        public DbSet<Test> Tests { get; set; }

    }
}
