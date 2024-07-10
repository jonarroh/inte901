namespace Server.Models.DTO
{
    public class DetailOrderDTO
    {
        public int Id { get; set; }
        public int IdProduct { get; set; }
        public string NameProduct { get; set; }
        public int Quantity { get; set; }
        public decimal PriceSingle { get; set; }
        public int Status { get; set; }
        public DateTime DateOrder { get; set; }
        public long Ticket { get; set; }
        public string Ingredients { get; set; }
    }
}
