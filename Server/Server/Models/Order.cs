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
        public int? Id { get; set; }
        public DateTime? OrderDate { get; set; }

        [ForeignKey("User")]
        public int? IdUser { get; set; }
        [Required]
        public float? Total { get; set; }
        
        
        public ICollection<DetailOrder>? DetailOrders { get; set; }
       
    }
}
