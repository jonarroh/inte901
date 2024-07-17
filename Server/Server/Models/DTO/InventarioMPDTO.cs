namespace Server.Models.DTO
{
    public class InventarioMPDTO
    {
        public int? Id { get; set; }
        public int? IdMateriaPrima { get; set; }
        public string? UnidadMedida { get; set; }
        public float? Cantidad { get; set; }
        public int? IdCompra { get; set; }
        public DateTime? Caducidad { get; set; }
        public int? Estatus { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}

