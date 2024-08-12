using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Server.Models
{
    public class Ingrediente
    {
        [Key]
        public int? Id { get; set; }
        public int? IdProducto { get; set; }
        [ForeignKey("ProductoId")]
        [JsonIgnore]
        public Producto? Producto { get; set; }
        public int? IdMateriaPrima { get; set; }
        [ForeignKey("MateriaPrimaId")]
        public MateriaPrima? MateriaPrima { get; set; }
        [Required]
        public decimal? Cantidad { get; set; }
        [Required]
        [MaxLength(40)]
        public string? UnidadMedida { get; set; }
        [Required]
        public int? Estatus { get; set; } = 1;
        public bool? EnMenu { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
