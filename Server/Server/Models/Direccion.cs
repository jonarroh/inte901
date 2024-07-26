using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Server.Models.Usuario.Server.Models.Usuario;
using System.ComponentModel;

namespace Server.Models
{
    public class Direcciones
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Calle { get; set; }

        public int NumeroExterior { get; set; }

        [DefaultValue("Activo")]
        public string estatus { get; set; }

        [Required]
        [MaxLength(100)]
        public string Colonia { get; set; }

        [Required]
        [MaxLength(100)]
        public string Ciudad { get; set; }

        [Required]
        [MaxLength(100)]
        public string Estado { get; set; }

        [Required]
        [MaxLength(100)]
        public string Pais { get; set; }

        [Required]
        [MaxLength(10)]
        public string CodigoPostal { get; set; }

        // Foreign key property to link to the User
        [ForeignKey("User")]
        public int UserId { get; set; }

    }
}
