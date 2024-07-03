namespace Server.Models.DTO
{
	public class OrderDTO
	{
		public int IdClient { get; set; }
		public int IdUser { get; set; }
		public float? Total { get; set; }
		
		
		public int? IdOrder { get; set; }
		public int? IdProduct { get; set; }
		public string? NameProduct { get; set; }
		public int? Quantity { get; set; }
		public decimal? PriceSingle { get; set; }
	}
}
