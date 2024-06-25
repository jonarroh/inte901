namespace Server.Models
{
	public class DetailPurchase
	{
		public int? Id { get; set; }
		public int? IdPurchase { get; set; }
		public int? IdProduct { get; set; }
		public int? Quantity { get; set; }
		public decimal? PriceSingle { get; set; }
		public String? Presentation { get; set; }
		public DateTime? Expiration { get; set; }
		public String? UnitType { get; set; }
		public DateTime? Created_at { get; set; }

		// Relacion con la tabla Purchase muchos a muchos
		public ICollection<Purchase>? Purchases { get; set; }

		// Relacion con la tabla Product muchos a muchos
		public ICollection<Product>? Products { get; set; }
	}
}
