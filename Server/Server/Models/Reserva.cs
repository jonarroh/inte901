using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Reserva
    {
        [Key]
        [Required]
        public int? idReserva {  get; set; }

        [ForeignKey("DetalleReservaId")]
        public int? idDetailReser { get; set; }

        [Required]
        [ForeignKey("UsuarioId")]
        public int? idUsuario { get; set; }

        [Required]
        public string? estatus { get; set; }

    }
}
