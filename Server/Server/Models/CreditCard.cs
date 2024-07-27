using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class CreditCard
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(16)]
        public string CardNumber { get; set; }

        [Required]
        [StringLength(5)]  // Assuming format MM/YY
        public string ExpiryDate { get; set; }

        [Required]
        [StringLength(3)]
        public string CVV { get; set; }

        [Required]
        [StringLength(100)]
        public string CardHolderName { get; set; }

        [DefaultValue("Activo")]
        public string Estatus { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

    }

    // Assuming this is a DTO or ViewModel and not part of the EF model
    public class CheckCreditCard
    {
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVV { get; set; }
        public string CardHolderName { get; set; }
        public int Id { get; set; }
        public decimal Amount { get; set; }
    }
}
