using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class InventarioPostre
    {
        public int? IdPostre { get; set; }
        public int? IdProducto { get; set; }
        public Producto? Producto { get; set; }
        public string? Cantidad { get; set; }
        public int? Estatus { get; set; } = 1;
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
    }
}
