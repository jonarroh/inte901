using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Server.Models.DTO;
using Server.Models;
using Newtonsoft.Json;

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
		[Route("Promos")]
		public async Task<IActionResult> GetPromos()
		{
			try
			{
				var promos = await _context.PromocionesPersonalizadas.Where(p => p.Estatus == 1).ToListAsync();

				if (promos == null || promos.Count == 0)
				{
					return BadRequest("No hay promos registradas");
				}

				return Ok(promos);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return NotFound("Vale kk");
			}
		}

		[HttpGet]
		[Route("allPromocionesPersonalizadas/{IdBadge}")]
		public async Task<IActionResult> GetAllPromocionesPersonalizadas(int IdBadge)
		{
			try
			{
				var promos = await _context.PromocionesPersonalizadas.Where(p => p.Estatus == 1).Where(p => p.BadgePromoId == IdBadge).Where(p =>  p.Motivo == "Cantidad").ToListAsync();
				if (promos == null || promos.Count == 0)
				{
					
				}
				return Ok(promos);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return NotFound("vale kk");
			}
		}

		[HttpPost]
		[Route("addPromocionPersonalizada")]
		public async Task<IActionResult> AddPersonalizada([FromBody] PromocionesPersonalizadasDTO data)
		{
			try
			{
				Console.WriteLine(JsonConvert.SerializeObject(data));

				if (data == null)
				{
					return BadRequest("No se recibieron datos");
				}

				if (data.Nombre == null || data.Descripcion == null || data.BadgePromoId == 0 || data.FechaInicio == null || data.FechaFin == null)
				{
					return BadRequest("Faltan datos");
				}

				var usuario = await _context.Users.FindAsync(data.UserId);

				if (usuario == null)
				{
					return BadRequest("Usuario no encontrado");
				}

				var promo = new PromocionesPersonalizadas
				{
					Nombre = data.Nombre,
					Descripcion = data.Descripcion,
					FechaInicio = data.FechaInicio,
					FechaFin = data.FechaFin,
					Descuento = data.Descuento,
					Estatus = data.Estatus,
					ProductoId = data.ProductoId,
					BadgePromoId = data.BadgePromoId,
					LimiteCanje = data.LimiteCanje,
					Motivo = data.Motivo,
					CreatedAt = DateTime.Now.ToString(),
					UpdatedAt = DateTime.Now.ToString(),
					DeletedAt = ""
				};

				await _context.PromocionesPersonalizadas.AddAsync(promo);

				await _context.SaveChangesAsync();

				return Ok(200);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return NotFound("Vale kk");
			}
		}

		[HttpGet]
		[Route("getPromocion/{id}")]
		public async Task<IActionResult> GetPromo(int id)
		{
			try
			{
				var promocion = await _context.PromocionesPersonalizadas.FindAsync(id);

				if (promocion == null)
				{
					return BadRequest("No se encontro la promocion");
				}
				else if (promocion.Estatus == 0)
				{
					return BadRequest("La promocion ha sido eliminada");
				}

				return Ok(promocion);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return NotFound("Vale kk");
			}
		}

		[HttpPut]
		[Route("updatePromocion/{id}")]
		public async Task<IActionResult> UpdatePromo(int id, [FromBody] PromocionesPersonalizadasDTO data)
		{
			try
			{
				var promocion = await _context.PromocionesPersonalizadas.FindAsync(id);
				var usuario = await _context.Users.FindAsync(data.UserId);

				if (promocion == null)
				{
					return BadRequest("No se encontro la promocion");
				}

				if (usuario.Role != "Admin")
				{
					return BadRequest("No tienes permisos para realizar esta accion");
				}

				promocion.Nombre = data.Nombre;
				promocion.Descripcion = data.Descripcion;
				promocion.Descuento = data.Descuento;
				promocion.Estatus = data.Estatus;
				promocion.LimiteCanje = data.LimiteCanje;
				promocion.UpdatedAt = DateTime.Now.ToString();
				promocion.FechaInicio = data.FechaInicio;
				promocion.FechaFin = data.FechaFin;

				if (data.ProductoId != 0)
				{
					promocion.ProductoId = data.ProductoId;
				}

				if (data.Motivo != "")
				{
					promocion.Motivo = data.Motivo;
				}

				if (data.BadgePromoId != 0)
				{
					promocion.BadgePromoId = data.BadgePromoId;
				}

				await _context.SaveChangesAsync();

				return Ok(200);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return NotFound("Vale kk");
			}
		}

		[HttpPut]
		[Route("deletePromocion/{id}")]
		public async Task<IActionResult> DeletePromo(int id)
		{
			try
			{
				Console.WriteLine(id);
				var promocion = await _context.PromocionesPersonalizadas.FindAsync(id);
				if (promocion == null)
				{
					return BadRequest("No se encontro la promoción");
				}
				promocion.DeletedAt = DateTime.Now.ToString();
				promocion.Estatus = 0;

				await _context.SaveChangesAsync();

				return Ok(200);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return NotFound("Se produjo un error en el servidor, contacte a soporte");
			}
		}
	}
}
