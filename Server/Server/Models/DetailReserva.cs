<<<<<<< HEAD
﻿using System;
using System.ComponentModel.DataAnnotations;
=======
﻿using System.ComponentModel.DataAnnotations;
>>>>>>> 88e1a8911d75b8a665bdfee0c40e377ed0b4f7b7
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class DetailReserva
    {
        [Key]
        [Required]
<<<<<<< HEAD
        public int idDetailReser { get; set; }
=======
        public int? idDetailReser { get; set; }
>>>>>>> 88e1a8911d75b8a665bdfee0c40e377ed0b4f7b7

        [Required]
        public DateTime fecha { get; set; }

        [Required]
<<<<<<< HEAD
        public string horaInicio { get; set; }

        [Required]
        public string horaFin { get; set; }

        [Required]
        [ForeignKey("Espacio")]
        public int idEspacio { get; set; }

        public virtual Espacio Espacio { get; set; }
=======
        public string? horaInicio { get; set; }

        [Required]
        public string? horaFin {  get; set; }

        [Required]
        [ForeignKey("EspacioId")]
        public int? idEspacio { get; set; }

>>>>>>> 88e1a8911d75b8a665bdfee0c40e377ed0b4f7b7
    }
}
