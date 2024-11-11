using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]

    public class LoggingController : Controller
    {
        // GET: LoggingController
        [HttpPost]
        [Route("logging")]
        public async Task<IActionResult> AddLoggging()
        {
            try
            {
                return Ok("Log registrado");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound("Error al registrar el log");
            }
        }
    }
}
