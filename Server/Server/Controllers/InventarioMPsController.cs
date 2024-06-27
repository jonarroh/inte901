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
    public class InventarioMPsController : ControllerBase
    {
        private readonly Context _context;

        public InventarioMPsController(Context context)
        {
            _context = context;
        }

        // GET: api/InventarioMPs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventarioMP>>> GetInventarioMPs()
        {
            return await _context.InventarioMPs.ToListAsync();
        }

        // GET: api/InventarioMPs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventarioMP>> GetInventarioMP(int? id)
        {
            var inventarioMP = await _context.InventarioMPs.FindAsync(id);

            if (inventarioMP == null)
            {
                return NotFound();
            }

            return inventarioMP;
        }

        // PUT: api/InventarioMPs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventarioMP(int? id, InventarioMP inventarioMP)
        {
            if (id != inventarioMP.Id)
            {
                return BadRequest();
            }

            _context.Entry(inventarioMP).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InventarioMPExists(id))
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

        // POST: api/InventarioMPs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<InventarioMP>> PostInventarioMP(InventarioMP inventarioMP)
        {
            _context.InventarioMPs.Add(inventarioMP);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInventarioMP", new { id = inventarioMP.Id }, inventarioMP);
        }

        // DELETE: api/InventarioMPs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventarioMP(int? id)
        {
            var inventarioMP = await _context.InventarioMPs.FindAsync(id);
            if (inventarioMP == null)
            {
                return NotFound();
            }

            _context.InventarioMPs.Remove(inventarioMP);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InventarioMPExists(int? id)
        {
            return _context.InventarioMPs.Any(e => e.Id == id);
        }
    }
}
