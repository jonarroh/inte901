using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class MateriaPrimaProveedor
    {
        [Key]
        public int? Id { get; set; }

        public int? MateriaPrimaId { get; set; }
        [ForeignKey("MateriaPrimaId")]
        public MateriaPrima? MateriaPrima { get; set; }
        public int? ProveedorId { get; set; }
        [ForeignKey("ProveedorId")]
        public Proveedor? Proveedor { get; set; }
    }
}
