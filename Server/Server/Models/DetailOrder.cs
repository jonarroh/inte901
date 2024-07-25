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
		public decimal? PriceSingle { get; set; }

		[Required]
		public DateTime? DateOrder { get; set; }

		[Required]
        public string Ingredients { get; set; }

		[Required]
		public string Status { get; set; }

        public Order Order { get; set; }

        public Producto Product { get; set; }
    }
}
