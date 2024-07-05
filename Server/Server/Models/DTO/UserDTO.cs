﻿namespace Server.Models.DTO
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string? Token { get; set; }

        public ICollection<Direcciones>? Direcciones { get; set; }

        public ICollection<CreditCardDTO>? CreditCards { get; set; }
    }
}
