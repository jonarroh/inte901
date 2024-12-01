using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Server.Models;
using Server.Models.DTO;
using System.Collections.Generic;
using System.Linq;


namespace Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EspaciosController : ControllerBase
	{
		private readonly Context _context;

		public EspaciosController(Context context)
		{
			_context = context;
		}

		// GET: api/Espacios
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Espacio>>> GetEspacios()
		{
			return Ok(await _context.Espacios.ToListAsync());
		}

		// GET: api/Espacios/5
		[HttpGet("{id}")]
		public async Task<ActionResult<Espacio>> GetEspacio(int id)
		{
			var espacio = await _context.Espacios.FindAsync(id);
			if (espacio == null)
			{
				return NotFound();
			}
			return Ok(espacio);
		}

		[HttpPost]
		public async Task<ActionResult<Espacio>> PostEspacio([FromForm] EspacioDTO form)
		{
			Console.Write(form.ToString());
			var espacioDTO = new EspacioDTO
			{
				nombre = form.nombre,
				canPersonas = form.canPersonas,
				precio = form.precio,
				descripcion = form.descripcion,
				estatus = form.estatus
			};

			var espacios = new Espacio
			{
				nombre = espacioDTO.nombre,
				canPersonas = espacioDTO.canPersonas,
				precio = espacioDTO.precio,
				estatus = espacioDTO.estatus,
				descripcion = espacioDTO.descripcion
			};

			_context.Espacios.Add(espacios);
			await _context.SaveChangesAsync();

			// Obtener el Id generado
			var id = espacios.idEspacio;
			Console.Write("el id es" + id);
			Console.Write(form.image != null);

			// Enviar la imagen al API de Python
			if (form.image != null)
			{
				var file = form.image;
				var result = await UploadImageToPythonApi(file, id);
				if (!result.IsSuccessStatusCode)
				{
					// Manejo de errores: si el envío de la imagen falla, puedes decidir cómo proceder
					return StatusCode((int)result.StatusCode, "Error al subir la imagen");
				}
			}

			return CreatedAtAction("GetEspacio", new { id = espacios.idEspacio }, espacios);
		}

		private async Task<HttpResponseMessage> UploadImageToPythonApi(IFormFile file, int id)
		{
			using (var client = new HttpClient())
			{
				using (var content = new MultipartFormDataContent())
				{
					content.Add(new StringContent(id.ToString()), "id");
					using (var ms = new MemoryStream())
					{
						await file.CopyToAsync(ms);
						var fileBytes = ms.ToArray();
						content.Add(new ByteArrayContent(fileBytes), "imagen", file.FileName);
					}

					var response = await client.PostAsync("http://191.101.1.86:5000/places/upload", content);
					return response;
				}
			}
		}




		[HttpPut("{id}")]
		public async Task<IActionResult> PutEspacio(int id, EspacioDTO espacioDTO)
		{


			var espacio = await _context.Espacios.FindAsync(id);
			if (espacio == null)
			{
				return NotFound();
			}

			espacio.nombre = espacioDTO.nombre;
			espacio.canPersonas = espacioDTO.canPersonas;
			espacio.precio = espacioDTO.precio;
			espacio.estatus = espacioDTO.estatus;
			espacio.descripcion = espacioDTO.descripcion;

			_context.Entry(espacio).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!EspacioExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			// Enviar la imagen al API de Python si se ha proporcionado una nueva imagen
			if (espacioDTO.image != null)
			{
				var result = await UploadImageToPythonApi(espacioDTO.image, id);
				if (!result.IsSuccessStatusCode)
				{
					// Manejo de errores: si el envío de la imagen falla, puedes decidir cómo proceder
					return StatusCode((int)result.StatusCode, "Error al subir la imagen");
				}
			}

			return NoContent();
		}



		// DELETE: api/Espacios/5
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteEspacio(int id)
		{
			var espacio = await _context.Espacios.FindAsync(id);
			if (espacio == null)
			{
				return NotFound();
			}

			// Change the status to "Inactivo"
			espacio.estatus = "Inactivo";
			_context.Espacios.Update(espacio);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		[HttpPut("{id}/activate")]
		public async Task<IActionResult> ActivarEspacio(int id)
		{
			var espacio = await _context.Espacios.FindAsync(id);
			if (espacio == null)
			{
				return NotFound();
			}


			espacio.estatus = "Activo";
			_context.Espacios.Update(espacio);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool EspacioExists(int id)
		{
			return _context.Espacios.Any(e => e.idEspacio == id);
		}

		[HttpPost]
        [Route("espacioMasSolicitado/{date}")]
        public async Task<IActionResult> EspacioMasSolicitado(string date)
        {
            try
            {
				// Determinar el rango de fechas
				var (start, end) = GetDateRange(date);
				if (start == null || end == null)
				{
					return BadRequest("Fecha no válida");
				}

				// Contar las reservas de cada espacio
				var espacios = await _context.Espacios.ToListAsync();
				var reservas = await _context.DetailReservas
					.Where(r => r.fecha >= start && r.fecha <= end)
					.ToListAsync();

				var espacioReservas = reservas
					.GroupBy(r => r.idEspacio)
					.Select(g => new
					{
						idEspacio = g.Key,
						Count = g.Count()
					})
					.OrderByDescending(g => g.Count)
					.FirstOrDefault();

				//if (espacioReservas == null)
				//{
				//	return NotFound("No se encontraron reservas en el rango de fechas especificado.");
				//}

				var espacioMasSolicitado = await _context.Espacios
					.Where(e => e.idEspacio == espacioReservas.idEspacio)
					.Select(e => new
					{
						e.nombre,
						reservas = espacioReservas.Count,
						personas = e.canPersonas
					})
					.FirstOrDefaultAsync();

				var result = new
				{
					ReservasEspacio = espacioMasSolicitado.reservas,
					PersonasEspacio = espacioMasSolicitado.personas,
					NombreEspacio = espacioMasSolicitado.nombre
				};

				Console.WriteLine(JsonConvert.SerializeObject(result.GetType()));

				return Ok(result);
			}
			catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500);
            }
        }




		// Método para calcular el rango de fechas
		private (DateTime?, DateTime?) GetDateRange(string date)
		{
			DateTime today = DateTime.UtcNow.Date;

			return date.ToLower() switch
			{
				"today" => (today, today),
				"yesterday" => (today.AddDays(-1), today.AddDays(-1)),
				"lastweek" => (today.AddDays(-7), today),
				"lastmonth" => (today.AddMonths(-1), today),
				"lastyear" => (today.AddYears(-1), today),
				_ => (null, null) // Valor por defecto si no coincide con los casos
			};
		}

	}

}
