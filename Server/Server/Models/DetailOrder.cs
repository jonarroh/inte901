namespace Server.Models
{
	public class DetailOrder
	{
		public int? Id { get; set; }
		public int? IdOrder { get; set; }
		public int? IdProduct { get; set; }
		public String? NameProduct { get; set; }
		public int? Quantity { get; set; }
		public decimal? PriceSingle { get; set; }
		public int? Status { get; set; }
		public DateTime? DateOrder { get; set; }
		public long? Ticket { get; set; }

		// Relacion con la tabla Order muchos a muchos
		public ICollection<Order>? Orders { get; set; }

		// Relacion con la tabla Product muchos a muchos
		public ICollection<Product>? Products { get; set; }
	}
}
