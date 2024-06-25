using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class MateriaPrimaProveedor
    {
        public int? Id { get; set; }

        public int? MateriaPrimaId { get; set; }
        public MateriaPrima? MateriaPrima { get; set; }
        public int? ProveedorId { get; set; }
        public Proveedor? Proveedor { get; set; }
    }
}
