namespace Server.Models
{
    using Server.Models.Usuario.Server.Models.Usuario;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class Order
    {
        [Key]
        public int? Id { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? IdClient { get; set; }
        public int? IdUser { get; set; }
        [Required]
        public float? Total { get; set; }
        
        
        public ICollection<DetailOrder>? DetailOrders { get; set; }
        
        public ICollection<User>? User { get; set; }
    }
}
