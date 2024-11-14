using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PromocionesPersonalizadasController : Controller
	{
		private readonly Context _context;
		public PromocionesPersonalizadasController(Context context)
		{
			_context = context;
		}
		[HttpGet]
		[Route("allPromocionesPersonalizadas")]
		public async Task<IActionResult> GetAllPromocionesPersonalizadas()
		{
			try
			{
				var promos = await _context.PromocionesPersonalizadas.ToListAsync();
				if (promos == null || promos.Count == 0)
				{
					return BadRequest("No hay promos registradas");
				}
				return Ok(promos);
			}
			catch (Exception ex)
			{
				return NotFound("vale kk");
			}
		}
	}
}
