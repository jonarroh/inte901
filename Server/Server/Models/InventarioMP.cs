using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class InventarioMP
    {
        [Key]
        public int? Id { get; set; }
        public int? IdMateriaPrima { get; set; }
        [ForeignKey("MateriaPrimaId")]
        public MateriaPrima? MateriaPrima { get; set; }
        [Required]
        [MaxLength(20)]
        public string? UnidadMedida { get; set; }
        [Required]
        [MaxLength(100)]
        public float? Cantidad { get; set; }
        public int? IdCompra { get; set; }
        [ForeignKey("IdCompra")]
        public Purchase? Compra { get; set; }
        [Required]
        public DateTime? Caducidad { get; set; }
        [Required]
        public bool? Estatus { get; set; } = 1;
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
    }
}
