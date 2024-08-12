
﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class DetailReserva
    {
        [Key]
        [Required]
        public int idDetailReser { get; set; }

        [Required]
        public DateTime fecha { get; set; }

        [Required]
        public string horaInicio { get; set; }

        [Required]
        public string horaFin { get; set; }

        [Required]
        [ForeignKey("Espacio")]
        public int idEspacio { get; set; }


        [NotMapped]
        public virtual Espacio Espacio { get; set; }


    }
}
