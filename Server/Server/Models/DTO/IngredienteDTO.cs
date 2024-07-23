namespace Server.Models.DTO
{
    public class IngredienteDTO
    {
        public int? Id { get; set; }
        public int? IdProducto { get; set; }
        public int? IdMateriaPrima { get; set; }
        public decimal? Cantidad { get; set; }
        public string? UnidadMedida { get; set; }
        public bool? Estatus { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
