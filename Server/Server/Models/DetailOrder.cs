namespace Server.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class DetailOrder
	{
		[Key]
		public int? Id { get; set; }

		[Required]
		public int? IdOrder { get; set; }

		[Required]
		public int? IdProduct { get; set; }

		[Required]
		[MaxLength(100)]
		public string? NameProduct { get; set; }

		[Required]
		public int? Quantity { get; set; }

		[Required]
		public decimal? PriceSingle { get; set; }

		[Required]
		public int? Status { get; set; }

		[Required]
		public DateTime? DateOrder { get; set; }

		[Required]
		public long? Ticket { get; set; }

        public Order Order { get; set; }

        public Producto Product { get; set; }
    }
}
