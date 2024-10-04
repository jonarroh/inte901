using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            Console.Write("el id es" +  id);
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

                    var response = await client.PostAsync("http://localhost:5000/places/upload", content);
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
    }
}
