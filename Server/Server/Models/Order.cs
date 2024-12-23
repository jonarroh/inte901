﻿namespace Server.Models
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
        public DateTime? OrderDate { get; set; }
        public int IdClient { get; set; }
        [Required]
        [ForeignKey("User")]
        public int? IdUser { get; set; }
        [Required]
        public float? Total { get; set; }

        [Required]
        public string Status { get; set; } // Aceptado, Cancelado, Recibido, Ordenado
        public long? Ticket { get; set; }
        public bool IsDeliver { get; set; }
        public ICollection<DetailOrder>? DetailOrders { get; set; }
        public int PromCode { get; set; } // Id de la promocion, default 0
        public float PromDesc { get; set; } // Descuento de la promocion, default 0
        public int TotalHeavenCoins { get; set; } // HeavenCoins generados por la compra, default 0
        [NotMapped]
        public User? User { get; set; }
        public Order()
        {
            DetailOrders = new List<DetailOrder>();
        }
    }
}
