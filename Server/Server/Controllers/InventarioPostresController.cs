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
    public class InventarioPostresController : ControllerBase
    {
        private readonly Context _context;

        public InventarioPostresController(Context context)
        {
            _context = context;
        }

        // GET: api/InventarioPostres
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventarioPostre>>> GetInventarioPostres()
        {
            return await _context.InventarioPostres.ToListAsync();
        }

        // GET: api/InventarioPostres/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventarioPostre>> GetInventarioPostre(int? id)
        {
            var inventarioPostre = await _context.InventarioPostres.FindAsync(id);

            if (inventarioPostre == null)
            {
                return NotFound();
            }

            return inventarioPostre;
        }

        // PUT: api/InventarioPostres/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventarioPostre(int? id, InventarioPostre inventarioPostre)
        {
            if (id != inventarioPostre.IdPostre)
            {
                return BadRequest();
            }

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

        // POST: api/InventarioPostres
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<InventarioPostre>> PostInventarioPostre(InventarioPostre inventarioPostre)
        {
            _context.InventarioPostres.Add(inventarioPostre);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInventarioPostre", new { id = inventarioPostre.IdPostre }, inventarioPostre);
        }

        // DELETE: api/InventarioPostres/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventarioPostre(int? id)
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

        private bool InventarioPostreExists(int? id)
        {
            return _context.InventarioPostres.Any(e => e.IdPostre == id);
        }
    }
}
