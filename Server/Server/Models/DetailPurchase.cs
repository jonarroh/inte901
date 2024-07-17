namespace Server.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class DetailPurchase
	{
		[Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }

		[Required]
		public int? IdPurchase { get; set; }

		[Required]
		public int? IdProduct { get; set; }

		[Required]
		public int? Quantity { get; set; }

		[Required]
		public decimal? PriceSingle { get; set; }

		[Required]
		public string? Presentation { get; set; }

		[Required]
		public DateTime? Expiration { get; set; }

		[Required]
		public string? UnitType { get; set; }

		[Required]
		public DateTime? CreatedAt { get; set; }
		[Required]
		public string? Status { get; set; } // Pendiente, Cancelado, Entregado
        public Purchase Purchase { get; set; }

        public Producto Product { get; set; }
    }
}
