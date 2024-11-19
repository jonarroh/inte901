namespace Server.Models.DTO
{
	public class PromocionesPersonalizadasDTO
	{
		public int Id { get; set; }
		public string Nombre { get; set; }
		public string Descripcion { get; set; }
		public string FechaInicio { get; set; }
		public string FechaFin { get; set; }
		public int Descuento { get; set; }
		public int Estatus { get; set; }
		public int ProductoId { get; set; }
		public int BadgePromoId { get; set; }
		public int LimiteCanje { get; set; }
		public string Motivo { get; set; }
		public int UserId { get; set; }
	}
}
