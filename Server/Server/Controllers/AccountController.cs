namespace Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Server.lib;
    using System.Security.Cryptography;
    using System.Text;
    using System.Threading.Tasks;

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

            // Verificar la contraseña
            if (user.Password != StringToSha256(password))
            {
                return Unauthorized(new { message = "Usuario o contraseña incorrectos" });
            }

            // Crear el token
            string token = _tokenService.CreateToken(email, user.Role);

            // Almacenar el token en las cookies
            Response.Cookies.Append("token", token, new CookieOptions { HttpOnly = true, Secure = true });

            return Ok(new { jwtToken = token });
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
