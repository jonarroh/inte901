using Server.Models.Usuario.Server.Models.Usuario;

namespace Server.Models.DTO
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public int AttemptsToBlock { get; set; }
        public string? Token { get; set; }

        public ICollection<Direcciones>? Direcciones { get; set; }

        public ICollection<CreditCard>? CreditCards { get; set; }
    }

    public class UserCaptchaDTO()
    {
        public string CaptchaToken { get; set; }
        public User User { get; set; }
    }


    public class UserEditDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string? NewPassword { get; set; }

        public string? ActualPassword { get; set; }

        public IFormFile? Image { get; set; }

        public ICollection<Direcciones>? Direcciones { get; set; }

        public ICollection<CreditCard>? CreditCards { get; set; }
    }
}
