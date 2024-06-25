namespace Server.Models.DTO
{
	public class OrderDTO
	{
		public int? Id { get; set; }
		public DateTime? OrderDate { get; set; }
		public int? IdClient { get; set; }
		public int? IdUser { get; set; }
		public float? Total { get; set; }
		public int? IdDetailOrder { get; set; }
		public int? IdOrder { get; set; }
		public int? IdProduct { get; set; }
		public String? NameProduct { get; set; }
		public int? Quantity { get; set; }
		public decimal? PriceSingle { get; set; }
		public int? Status { get; set; }
		public DateTime? DateOrder { get; set; }
		public long? Ticket { get; set; }
		public DateTime? Created_at_detail { get; set; }
	}
}
