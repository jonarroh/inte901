using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server;
using Server.Models;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventarioPostresController : ControllerBase
    {
        private readonly Context _context;

        public InventarioPostresController(Context context)
        {
            _context = context;
        }

        // GET: api/InventarioPostre
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventarioPostre>>> GetInventarioPostres()
        {
            return await _context.InventarioPostres.ToListAsync();
        }

        // GET: api/InventarioPostre/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventarioPostre>> GetInventarioPostre(int id)
        {
            var inventarioPostre = await _context.InventarioPostres.FindAsync(id);

            if (inventarioPostre == null)
            {
                return NotFound();
            }

            return inventarioPostre;
        }

        // PUT: api/InventarioPostre/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventarioPostre(int id, InventarioPostreDTO inventarioPostreDTO)
        {
            if (id != inventarioPostreDTO.IdPostre)
            {
                return BadRequest();
            }

            var inventarioPostre = await _context.InventarioPostres.FindAsync(id);
            if (inventarioPostre == null)
            {
                return NotFound();
            }

            inventarioPostre.IdProducto = inventarioPostreDTO.IdProducto;
            inventarioPostre.Cantidad = inventarioPostreDTO.Cantidad;
            inventarioPostre.Estatus = inventarioPostreDTO.Estatus;
            inventarioPostre.CreatedAt = inventarioPostreDTO.CreatedAt ?? inventarioPostre.CreatedAt;

            _context.Entry(inventarioPostre).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventarioPostreExists(id))
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

        // POST: api/InventarioPostre
        [HttpPost]
        public async Task<ActionResult<InventarioPostre>> PostInventarioPostre(InventarioPostreDTO inventarioPostreDTO)
        {
            var inventarioPostre = new InventarioPostre
            {
                IdProducto = inventarioPostreDTO.IdProducto,
                Cantidad = inventarioPostreDTO.Cantidad,
                Estatus = inventarioPostreDTO.Estatus,
                CreatedAt = inventarioPostreDTO.CreatedAt ?? DateTime.Now
            };

            _context.InventarioPostres.Add(inventarioPostre);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInventarioPostre", new { id = inventarioPostre.IdPostre }, inventarioPostre);
        }

        // DELETE: api/InventarioPostre/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventarioPostre(int id)
        {
            var inventarioPostre = await _context.InventarioPostres.FindAsync(id);
            if (inventarioPostre == null)
            {
                return NotFound();
            }

            _context.InventarioPostres.Remove(inventarioPostre);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InventarioPostreExists(int id)
        {
            return _context.InventarioPostres.Any(e => e.IdPostre == id);
        }
    }
}
