using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Proveedor
    {
        [Key]
        public int? Id { get; set; }
        [Required]
        [MaxLength(200)]
        public string? NombreEmpresa { get; set; }
        [Required]
        [MaxLength(200)]
        public string? DireccionEmpresa { get; set; }
        [Required]
        [MaxLength(13)]
        public string? TelefonoEmpresa { get; set; }
        [Required]
        [MaxLength(80)]
        public string? NombreEncargado { get; set; }
        [Required]
        public int? Estatus { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }

        public int? IdUsuario { get; set; }
        [ForeignKey("IdUsuario")]

        //public Usuario Usuario { get; set; }

        public ICollection<MateriaPrimaProveedor>? MateriaPrimaProveedores { get; set; }

    }
}
