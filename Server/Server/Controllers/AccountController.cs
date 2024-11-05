namespace Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Server.lib;
    using Server.Models;
    using System.Security.Cryptography;
    using System.Text;

    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly Context _context;

        public AccountController(TokenService tokenService, Context context)
        {
            _tokenService = tokenService;
            _context = context;
        }



        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null)
            {
                return BadRequest(new { message = "Invalid login request" });
            }      

            string email = loginRequest.Email ?? throw new ArgumentNullException(nameof(loginRequest.Email));
            string password = loginRequest.Password ?? throw new ArgumentNullException(nameof(loginRequest.Password));

            // Encontrar el usuario en la base de datos
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                return NotFound(new { message = "No se encontró el usuario" });
            }

            // Verificar si la cuenta está bloqueada
            if (user.IsBlockedUntil != null && DateTime.UtcNow < user.IsBlockedUntil)
            {
                var timeRemaining = (user.IsBlockedUntil.Value - DateTime.UtcNow).TotalMinutes;
                return Unauthorized(new { message = $"La cuenta está bloqueada. Inténtelo de nuevo en {timeRemaining:F1} minutos." });
            }

            // Verificar la contraseña
            if (user.Password != StringToSha256(password))
            {
                // Actualizar el conteo de intentos fallidos
                user.AttemptsToBlock--;
                user.LastFailedLoginAttempt = DateTime.UtcNow;

                // Bloquear la cuenta si los intentos fallidos son 0
                if (user.AttemptsToBlock <= 0)
                {
                    user.IsBlockedUntil = DateTime.UtcNow.AddMinutes(5); // Bloquear por 5 minutos
                    user.AttemptsToBlock = 3; // Reiniciar el conteo de intentos
                }

                _context.SaveChanges();
                return Unauthorized(new { message = "Usuario o contraseña incorrectos" });
            }

            // Restablecer los intentos fallidos si el inicio de sesión es exitoso
            user.AttemptsToBlock = 3;
            user.LastFailedLoginAttempt = null;
            user.IsBlockedUntil = null;

            // Obtener la última sesión antes de actualizarla
            DateTime? previousLastSession = user.LastSession;

            if (previousLastSession.HasValue)
            {
                previousLastSession = TimeZoneInfo.ConvertTimeFromUtc(previousLastSession.Value, TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time"));
            }

            // Registrar la última sesión
            user.LastSession = DateTime.UtcNow;

            // Crear el token
            string token = _tokenService.CreateToken(email, user.Role, user.Id);

            // Almacenar el token en las cookies
            Response.Cookies.Append("token", token, new CookieOptions { HttpOnly = true, Secure = true });

            var log = new Logging();

            log.IdUser = user.Id;
            log.Date = DateTime.Now;
            log.Rol = user.Role;

            _context.Add(log);

            _context.SaveChanges();

            return Ok(new { jwtToken = token, id = user.Id, lastSession = previousLastSession });
        }

        public static string StringToSha256(string str)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(str));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }


        [HttpGet("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token");
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("NotFoundMessage")]
        public IActionResult NotFoundMessage(string message)
        {
            // Puedes personalizar la respuesta aquí
            return NotFound(new { Message = message ?? "Resource not found" });
        }

    }

    public class LoginRequest
    {
        public string? Email { get; set; } 
        public string? Password { get; set; }

    }

    

}
