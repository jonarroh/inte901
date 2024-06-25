namespace Server.Models
{
    public class Order
    {
        public int? Id { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? IdClient { get; set; }
        public int? IdUser { get; set; }
        public float? Total { get; set; }
        
        // Relacion con la tabla DetailOrder muchos a muchos
        public ICollection<DetailOrder>? DetailOrders { get; set; }

        // Relacion con la tabla Users uno a muchos
        public Users User { get; set; }
    }
}
