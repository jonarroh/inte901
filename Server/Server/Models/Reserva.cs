using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Models.Usuario.Server.Models.Usuario;

namespace Server.Models
{
    public class Reserva
    {
        [Key]
        [Required]
        public int idReserva { get; set; }

        [ForeignKey("DetailReserva")]
        public int idDetailReser { get; set; }

        [Required]
        [ForeignKey("User")]
        public int idUsuario { get; set; }

        [Required]
        [ForeignKey("User")]
        public int idCliente { get; set; }

        [Required]
        public string estatus { get; set; }

        public virtual DetailReserva DetailReserva { get; set; }
        public virtual User Usuario { get; set; }
    }
}
