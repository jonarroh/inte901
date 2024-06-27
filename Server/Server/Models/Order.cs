namespace Server.Models
{
    using Server.Models.Usuario.Server.Models.Usuario;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
	using System.ComponentModel.DataAnnotations.Schema;

	public class Order
    {
        [Key]
        public int? Id { get; set; }
        [Required]
        public DateTime? OrderDate { get; set; }

        public int? IdClient { get; set; }
        [ForeignKey("IdUser")]
        [Required]
        public int? IdUser { get; set; }
        [Required]
        public float? Total { get; set; }
        
        
        public ICollection<DetailOrder>? DetailOrders { get; set; }
        
        public User? User { get; set; }
    }
}
