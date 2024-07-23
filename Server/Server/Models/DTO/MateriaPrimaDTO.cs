namespace Server.Models.DTO
{
    public class MateriaPrimaDTO
    {
        public int Id { get; set; }
        public string? Material { get; set; }
        public bool? Estatus { get; set; }
        public string? Imagen { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
