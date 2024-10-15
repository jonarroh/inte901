namespace Server.Models.DTO
{
    public class DetailOrderDTO
    {
        public int Id { get; set; }
        public int IdProduct { get; set; }
        public int IdOrder { get; set; }
        public int Quantity { get; set; }
        public decimal PriceSingle { get; set; }
        public DateTime DateOrder { get; set; }
        public string Ingredients { get; set; }
        public string Status { get; set; }
        //public int HeavenCoins { get; set; } // HeavenCoins del producto
    }
}
