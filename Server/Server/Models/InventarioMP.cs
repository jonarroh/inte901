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
        public string? Cantidad { get; set; }
        public int? IdCompra { get; set; }
        //[ForeignKey("IdCompra")]
        //public Compra Compra { get; set; }
        [Required]
        public DateTime? Caducidad { get; set; }
        [Required]
        public int? Estatus { get; set; } = 1;
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
    }
}
