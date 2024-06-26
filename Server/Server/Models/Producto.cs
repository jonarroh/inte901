using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Producto
    {
        [Key]
        public int? Id { get; set; }
        [Required]
        [MaxLength(255)]
        public string? Nombre { get; set; }
        [Required]
        public decimal? Precio { get; set; }

        public string? Descripcion { get; set; }
        [Required]
        public int? Estatus { get; set; } = 1;
        [Required]
        public int? CantidadXReceta { get; set; }
        [Required]
        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        public ICollection<Ingrediente>? Ingredientes { get; set; }
        public ICollection<InventarioPostre>? InventarioPostres { get; set; }
    }
}
