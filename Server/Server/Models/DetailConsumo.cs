using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class DetailConsumo
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }

        [Required]
        public int? Quantity { get; set; }

        [Required]
        public decimal? PriceSingle { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        [ForeignKey("IdConsumo")]
        public int? IdConsumo { get; set; }

        [Required]
        [ForeignKey("IdProduct")]
        public int? IdProduct { get; set; }

        [NotMapped]
        public virtual Consumo Consumo { get; set; }

        [NotMapped]
        public virtual Producto Product { get; set; }
    }



    public class DetailConsumoDTO
    {
        public int? Id { get; set; }

        public int? Quantity { get; set; }

        public decimal? PriceSingle { get; set; }

        public string Status { get; set; }

        public int? IdConsumo { get; set; }

        public int? IdProduct { get; set; }

    }   
}
