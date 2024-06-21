namespace Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Server.lib;
    using System.Threading.Tasks;

    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly TokenService _tokenService;

        public AccountController(TokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            // Aquí deberías validar las credenciales del usuario.
            // Para simplificar, asumimos que las credenciales son válidas y que los datos del usuario son correctos.

            string email = loginRequest.Email ?? throw new ArgumentNullException(nameof(loginRequest.Email));
            string role = loginRequest.Role ?? throw new ArgumentNullException(nameof(loginRequest.Role));

            string token = _tokenService.CreateToken(email, role);

            // Almacenar el token en las cookies
            Response.Cookies.Append("token", token, new CookieOptions { HttpOnly = true, Secure = true });

            return Ok(new { message = "Logged in successfully", jwtToken = token });
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

        public string? Role { get; set; }

    }

    

}
