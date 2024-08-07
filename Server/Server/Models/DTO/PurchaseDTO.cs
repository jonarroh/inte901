namespace Server.Models.DTO
{
	public class PurchaseDTO
	{
		public int Id { get; set; }
		public int IdProveedor { get; set; }
		public int IdUser { get; set; }
		public DateTime CreatedAt { get; set; }
		public string Status { get; set; }

		public List<DetailPurchaseDTO> Details { get; set; } = new List<DetailPurchaseDTO>();
	}
}
