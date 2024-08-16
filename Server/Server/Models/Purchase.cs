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
        [ForeignKey("IdUser")]
        public int? IdUser { get; set; }
        [Required]
        public DateTime? CreatedAt { get; set; }
        [Required]
        public float? Total { get; set; }
        [Required]
        public string Status { get; set; }
        public ICollection<DetailPurchase>? DetailPurchases { get; set; }
        [NotMapped]
        public User? User { get; set; }
        public Purchase()
        {
            DetailPurchases = new List<DetailPurchase>();
        }
    }
}
