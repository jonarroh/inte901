namespace Server.Models.DTO
{
	public class PurchaseDTO
	{
		public int? Id { get; set; }
		public int? IdProveedor { get; set; }
		public int? IdUser { get; set; }
		public DateTime? Created_at { get; set; }
		public int? IdDetailPurchase { get; set; }
		public int? IdPurchase { get; set; }
		public int? IdProduct { get; set; }
		public int? Quantity { get; set; }
		public decimal? PriceSingle { get; set; }
		public String? Presentation { get; set; }
		public DateTime? Expiration { get; set; }
		public String? UnitType { get; set; }
		public DateTime? Created_at_detail { get; set; }
	}
}
