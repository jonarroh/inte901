namespace Server.Models.DTO
{
	public class OrderDTO
	{
        public int Id { get; set; }
        public int IdClient { get; set; }
        public int IdUser { get; set; }
        public float Total { get; set; }
        public bool IsDeliver {  get; set; }
        public DateTime OrderDate { get; set; }
        public List<DetailOrderDTO> DetailOrders { get; set; } = new List<DetailOrderDTO>();
        public CreditCard? CreditCard { get; set; }
        public Direcciones? Direcciones { get; set;}
    }
}
