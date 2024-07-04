namespace Server.Models
{
   
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using Server.Models.Usuario.Server.Models.Usuario;

	public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }
        [Required]
        public DateTime? OrderDate { get; set; }
        public int? IdClient { get; set; }
        [Required]
        [ForeignKey("User")]
        public int? IdUser { get; set; }
        [Required]
        public float? Total { get; set; }
        public ICollection<DetailOrder>? DetailOrders { get; set; }
        public User? User { get; set; }
    }
}
