using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Producto
    {
        public int? Id { get; set; }

        public string? Nombre { get; set; }

        public decimal? Precio { get; set; }

        public string? Descripcion { get; set; }

        public int? Estatus { get; set; } = 1;

        public int? CantidadXReceta { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        public ICollection<Ingrediente>? Ingredientes { get; set; }
        public ICollection<InventarioPostre>? InventarioPostres { get; set; }
    }
}
