namespace Server.Models.Usuario
{
    using System;
    using System.Collections.Generic;
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

            [Required]
            [MaxLength(50)]
            public string Role { get; set; }

            public DateTime CreatedAt { get; set; }

            [MaxLength(100)]
            public string? Token { get; set; }

            // Navigation property for the related addresses
            public ICollection<Direcciones> Direcciones { get; set; }
        }

    }
}
    

