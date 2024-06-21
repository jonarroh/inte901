
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    [HttpGet("protected")]
    [Authorize]
    public IActionResult ProtectedRoute()
    {
        return Ok("This is a protected route");
    }

    [HttpGet("admin")]
    [Authorize(Roles = "admin")]
    public IActionResult AdminRoute()
    {
        return Ok("This is an admin route");
    }

    [HttpGet("multiRole")]
    [Authorize(Roles = "admin,empleado,cliente")]
    public IActionResult MultiRoleRoute()
    {
        return Ok("This route can be accessed by admin, empleado, and cliente");
    }
}
