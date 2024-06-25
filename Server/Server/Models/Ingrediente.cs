using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Ingrediente
    {
        public int? Id { get; set; }
        public int? IdProducto { get; set; }
        public Producto? Producto { get; set; }
        public int? IdMateriaPrima { get; set; }
        public MateriaPrima? MateriaPrima { get; set; }
        public decimal? Cantidad { get; set; }
        public string? UnidadMedida { get; set; }
        public int? Estatus { get; set; } = 1;
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
