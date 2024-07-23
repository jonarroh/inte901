namespace Server.Models.DTO
{
    public class ProveedorDTO
    {
        public int? Id { get; set; }
        public string? NombreEmpresa { get; set; }
        public string? DireccionEmpresa { get; set; }
        public string? TelefonoEmpresa { get; set; }
        public string? NombreEncargado { get; set; }
        public bool? Estatus { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public int? IdUsuario { get; set; }
    }
}
