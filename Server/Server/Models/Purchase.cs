namespace Server.Models
{
    public class Purchase
    {
        public int? Id { get; set; }
        public int? IdProveedor { get; set; }
        public int? IdUser { get; set; }
        public DateTime? Created_at { get; set; }

        // Relacion con la tabla DetailPurchase muchos a muchos
        public ICollection<DetailPurchase>? DetailPurchases { get; set; }

        // Relacion con la tabla Proveedor uno a muchos
        public Proveedor Proveedor { get; set; }

        // Relacion con la tabla User uno a muchos
        public Users User { get; set; }
    }
}
