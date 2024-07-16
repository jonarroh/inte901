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
		public DateTime? DateOrder { get; set; }

		[Required]
		public long? Ticket { get; set; }
        public string Ingredients { get; set; } = string.Empty;

        public Order Order { get; set; }

        public Producto Product { get; set; }
    }
}
