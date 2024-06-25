using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class MateriaPrima
    {
        public int Id { get; set; }

        public string? Material { get; set; }

        public int? Estatus { get; set; } = 1;

        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

        public ICollection<MateriaPrimaProveedor>? MateriaPrimaProveedores { get; set; }
        public ICollection<InventarioMP>? InventarioMps { get; set; }
        public ICollection<Ingrediente>? Ingredientes { get; set; }
    }
}
