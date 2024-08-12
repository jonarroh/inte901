namespace Server.Models.DTO
{
    public class DetailPurchaseDTO
    {
        public int Id { get; set; }
        public int IdPurchase { get; set; }
        public int IdProveedor { get; set; }
        public int IdMP { get; set; }
        public int Quantity { get; set; }
        public decimal PriceSingle { get; set; }
        public string Presentation { get; set; }
        public DateTime Expiration {  get; set; }
        public string UnitType { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; }
    }
}
