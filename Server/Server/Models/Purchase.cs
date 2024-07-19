namespace Server.Models
{
    using Server.Models.Usuario.Server.Models.Usuario;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
	using System.ComponentModel.DataAnnotations.Schema;

	public class Purchase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }
        [Required]
        [ForeignKey("IdProveedor")]
        public int? IdProveedor { get; set; }
        [Required]
        [ForeignKey("IdUser")]
        public int? IdUser { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? Status { get; set; } // Pendiente, Aceptada, Cancelada, Entregada
        public ICollection<DetailPurchase>? DetailPurchases { get; set; }
        public Proveedor? Proveedor { get; set; }
		public User? User { get; set; }
        public Purchase()
        {
            DetailPurchases = new List<DetailPurchase>();
        }
	}
}
