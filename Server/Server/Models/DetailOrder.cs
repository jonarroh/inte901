namespace Server.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class DetailOrder
	{
		[Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }

		[Required]
		public int? Quantity { get; set; }

		[Required]
		[Column(TypeName = "decimal(18, 2)")]
		public decimal? PriceSingle { get; set; }

		[Required]
		public DateTime? DateOrder { get; set; }

		[Required]
        public string Ingredients { get; set; }

		[Required]
		public string Status { get; set; }

        [Required]
        [ForeignKey("IdOrder")]
        public int? IdOrder { get; set; }

        [Required]
        [ForeignKey("IdProduct")]
        public int? IdProduct { get; set; }
        public int HeavenCoins { get; set; } // HeavenCoins del producto
        [NotMapped]
        public Order Order { get; set; }
        [NotMapped]
        public Producto Product { get; set; }
    }
}
