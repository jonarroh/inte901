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
        //public int PromCode { get; set; } // Id de la promocion, default 0
        //public float PromDesc { get; set; } // Descuento de la promocion, default 0
        //public int TotalHeavenCoins { get; set; } // HeavenCoins generados por la compra, default 0
    }
}
