namespace Server.Models.Usuario
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;

    namespace Server.Models.Usuario
    {
        public class User
        {
            [Key]
            public int Id { get; set; }

            [Required]
            [MaxLength(100)]
            public string Name { get; set; }

            [Required]
            [MaxLength(100)]
            public string LastName { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            [MaxLength(100)]
            public string Password { get; set; }

            [DefaultValue("Activo")]
            public string Estatus { get; set; }

            [Required]
            [MaxLength(50)]
            public string Role { get; set; }
            [Required]
            public int AttemptsToBlock { get; set; } = 3;

            public DateTime CreatedAt { get; set; }

            [MaxLength(100)]
            public string? Token { get; set; }
            public DateTime? LastSession { get; set; }

            // Propiedad para rastrear los intentos fallidos
            public DateTime? LastFailedLoginAttempt { get; set; }

            // Propiedad para saber si la cuenta está bloqueada
            public DateTime? IsBlockedUntil { get; set; }

            // Navigation property for the related addresses
            public ICollection<Direcciones> Direcciones { get; set; }
            public ICollection<CreditCard> CreditCards { get; set; }
        }

    }
}
    

