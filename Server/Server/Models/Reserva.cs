<<<<<<< HEAD
﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Models.Usuario.Server.Models.Usuario;
=======
﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
>>>>>>> 88e1a8911d75b8a665bdfee0c40e377ed0b4f7b7

namespace Server.Models
{
    public class Reserva
    {
        [Key]
        [Required]
<<<<<<< HEAD
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
=======
        public int? idReserva {  get; set; }

        [ForeignKey("DetalleReservaId")]
        public int? idDetailReser { get; set; }

        [Required]
        [ForeignKey("UsuarioId")]
        public int? idUsuario { get; set; }

        [Required]
        public string? estatus { get; set; }

>>>>>>> 88e1a8911d75b8a665bdfee0c40e377ed0b4f7b7
    }
}
