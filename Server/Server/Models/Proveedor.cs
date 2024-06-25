using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Proveedor
    {
        public int? Id { get; set; }
        public string? NombreEmpresa { get; set; }
        public string? DireccionEmpresa { get; set; }
        public string? TelefonoEmpresa { get; set; }
        public string? NombreEncargado { get; set; }
        public int? Estatus { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }

        public int? IdUsuario { get; set; }

        //public Usuario Usuario { get; set; }

        public ICollection<MateriaPrimaProveedor>? MateriaPrimaProveedores { get; set; }

    }
}
