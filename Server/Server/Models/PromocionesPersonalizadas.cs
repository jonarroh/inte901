namespace Server.Models
{
	using System;
	using System.Collections.Generic;
	using System.ComponentModel.DataAnnotations;
	using System.ComponentModel.DataAnnotations.Schema;
	using System.Diagnostics.CodeAnalysis;
	public class PromocionesPersonalizadas
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public string Motivo { get; set; }
		public int ProductoId { get; set; }
		public int Estatus { get; set; }
		public int Descuento { get; set; }
		public string Nombre { get; set; }
		public string Descripcion { get; set; }
		public int BadgePromoId { get; set; }
		public  DateOnly CreatedAt { get; set; }
		public DateOnly UpdatedAt { get; set; }
		[AllowNull]
		public DateOnly DeletedAt { get; set; }
	}
}
