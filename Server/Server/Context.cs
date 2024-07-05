using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Models.Usuario.Server.Models.Usuario;
using Server.Models.DTO;

namespace Server
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Direcciones> Direcciones { get; set; }
        public DbSet<Ingrediente> Ingredientes { get; set; }
        public DbSet<InventarioMP> InventarioMPs { get; set; }
        public DbSet<InventarioPostre> InventarioPostres { get; set; }
        public DbSet<MateriaPrima> MateriasPrimas { get; set; }
        public DbSet<MateriaPrimaProveedor> MateriaPrimaProveedores { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Proveedor> Proveedores { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<DetailPurchase> DetailPurchases { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<DetailOrder> DetailOrders { get; set; }
        public DbSet<CreditCard> CreditCard { get; set; } = default!;
    }
}
