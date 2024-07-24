namespace Server.Models.DTO
{
    public class ProductoDTO
    {
        public int? Id { get; set; }
        public string? Nombre { get; set; }
        public decimal? Precio { get; set; }
        public string? Descripcion { get; set; }
        public int? Estatus { get; set; }
        public string Tipo { get; set; }
        public int? CantidadXReceta { get; set; }
        public string? Temperatura { get; set; }
        public string? Imagen { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
