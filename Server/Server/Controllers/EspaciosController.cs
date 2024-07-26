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



        // POST: api/Espacios
        [HttpPost]
        public async Task<ActionResult<Espacio>> PostEspacio(EspacioDTO espacioDTO)
        {
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

            return CreatedAtAction("GetEspacio", new { id = espacios.idEspacio }, espacios);

        }

        // PUT: api/Espacios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEspacio(int id, Espacio updatedEspacio)
        {
            if (id != updatedEspacio.idEspacio)
            {
                return BadRequest("Espacio ID mismatch.");
            }

            var espacio = await _context.Espacios.FindAsync(id);
            if (espacio == null)
            {
                return NotFound();
            }

            espacio.nombre = updatedEspacio.nombre;
            espacio.canPersonas = updatedEspacio.canPersonas;
            espacio.precio = updatedEspacio.precio;
            espacio.estatus = updatedEspacio.estatus;
            espacio.descripcion = updatedEspacio.descripcion;

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

            _context.Espacios.Remove(espacio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EspacioExists(int id)
        {
            return _context.Espacios.Any(e => e.idEspacio == id);
        }
    }
}
