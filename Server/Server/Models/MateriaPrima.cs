using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class MateriaPrima
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string? Material { get; set; }

        [Required]
        public int? Estatus { get; set; } = 1;

        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

        public ICollection<MateriaPrimaProveedor>? MateriaPrimaProveedores { get; set; }
        public ICollection<InventarioMP>? InventarioMps { get; set; }
        public ICollection<Ingrediente>? Ingredientes { get; set; }
    }
}
