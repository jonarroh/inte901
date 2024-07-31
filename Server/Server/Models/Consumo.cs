using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Consumo
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }


        [Required]
        [ForeignKey("Reserva")]
        public int IdReserva { get; set; }


        [Required]
        public decimal Total { get; set; }

        [Required]
        public string Status { get; set; }

        public virtual Reserva Reserva { get; set; }

        public virtual ICollection<DetailConsumo> DetailConsumo { get; set; }
    }

    public class consumoDTO { 
        
        public int Id { get; set; }

        public int IdReserva { get; set; }

        public decimal Total { get; set; }

        public string Status { get; set; }

        public ICollection<DetailConsumoDTO> DetailConsumo { get; set; }

    }
}
