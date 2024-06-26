using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class InventarioPostre
    {
        [Key]
        public int? IdPostre { get; set; }
        [ForeignKey("ProductoId")]
        public int? IdProducto { get; set; }
        public Producto? Producto { get; set; }
        [Required]
        [MaxLength(100)]
        public string? Cantidad { get; set; }
        [Required]
        public int? Estatus { get; set; } = 1;
        [Required]
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
    }
}
