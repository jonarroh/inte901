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

        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<DetailPurchase> DetailPurchases { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<DetailOrder> DetailOrders { get; set; }
    }
}
