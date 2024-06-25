using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class InventarioMP
    {
        public int? Id { get; set; }
        public int? IdMateriaPrima { get; set; }
        public MateriaPrima? MateriaPrima { get; set; }
        public string? UnidadMedida { get; set; }
        public string? Cantidad { get; set; }
        public int? IdCompra { get; set; }
        //public Compra Compra { get; set; }
        public DateTime? Caducidad { get; set; }
        public int? Estatus { get; set; } = 1;
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
    }
}
