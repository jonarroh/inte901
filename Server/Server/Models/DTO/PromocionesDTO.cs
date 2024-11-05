namespace Server.Models.DTO
{
    public class PromocionesDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string FechaInicio { get; set; }
        public string FechaFin { get; set; }
        public int Descuento { get; set; }
        public int Estado { get; set; }
        public int Productos { get; set; }
        public int BadgePromoId { get; set; }
        public int LimiteCanje { get; set; }
        public int UserId { get; set; }
    }
}
