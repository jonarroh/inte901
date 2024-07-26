using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DireccionesController : ControllerBase
    {
        private readonly Context _context;

        public DireccionesController(Context context)
        {
            _context = context;
        }

        // GET: api/Direcciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Direcciones>>> GetDirecciones()
        {
            return await _context.Direcciones
                                 .Where(d => d.Estatus == "Activo")
                                 .ToListAsync();
        }

        // GET: api/Direcciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Direcciones>> GetDirecciones(int id)
        {
            var direcciones = await _context.Direcciones
                                            .Where(d => d.Id == id && d.Estatus == "Activo")
                                            .FirstOrDefaultAsync();

            if (direcciones == null)
            {
                return NotFound();
            }

            return direcciones;
        }

        // PUT: api/Direcciones/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDirecciones(int id, Direcciones direcciones)
        {
            if (id != direcciones.Id)
            {
                return BadRequest();
            }

            _context.Entry(direcciones).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DireccionesExists(id))
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

        // POST: api/Direcciones
        [HttpPost]
        public async Task<ActionResult<Direcciones>> PostDirecciones(Direcciones direcciones)
        {
            direcciones.Estatus = "Activo";
            _context.Direcciones.Add(direcciones);
            await _context.SaveChangesAsync();

            // Actualizar el usuario
            var user = await _context.Users.FindAsync(direcciones.UserId);
            if (user == null)
            {
                return NotFound();
            }

            user.Direcciones.Add(direcciones);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDirecciones", new { id = direcciones.Id }, direcciones);
        }

        // DELETE: api/Direcciones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDirecciones(int id)
        {
            var direcciones = await _context.Direcciones.FindAsync(id);
            if (direcciones == null)
            {
                return NotFound();
            }

            direcciones.Estatus = "Inactivo";
            _context.Entry(direcciones).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DireccionesExists(int id)
        {
            return _context.Direcciones.Any(e => e.Id == id);
        }
    }
}
