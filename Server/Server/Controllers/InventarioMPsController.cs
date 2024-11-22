using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server;
using Server.Models;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class InventarioMPsController : ControllerBase
    {
        private readonly Context _context;

        public InventarioMPsController(Context context)
        {
            _context = context;
        }

        // GET: api/InventarioMP
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventarioMP>>> GetInventarioMPs()
        {
            return await _context.InventarioMPs.ToListAsync();
        }

        // GET: api/InventarioMP/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventarioMP>> GetInventarioMP(int id)
        {
            var inventarioMP = await _context.InventarioMPs.FindAsync(id);

            if (inventarioMP == null)
            {
                return NotFound();
            }

            return inventarioMP;
        }

        // PUT: api/InventarioMP/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventarioMP(int id, InventarioMPDTO inventarioMPDTO)
        {
            if (id != inventarioMPDTO.Id)
            {
                return BadRequest();
            }

            var inventarioMP = await _context.InventarioMPs.FindAsync(id);
            if (inventarioMP == null)
            {
                return NotFound();
            }

            inventarioMP.IdMateriaPrima = inventarioMPDTO.IdMateriaPrima;
            inventarioMP.UnidadMedida = inventarioMPDTO.UnidadMedida;
            inventarioMP.Cantidad = inventarioMPDTO.Cantidad;
            inventarioMP.IdCompra = inventarioMPDTO.IdCompra;
            inventarioMP.Caducidad = inventarioMPDTO.Caducidad;
            inventarioMP.Estatus = inventarioMPDTO.Estatus;

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

        // POST: api/InventarioMP
        [HttpPost]
        public async Task<ActionResult<InventarioMP>> PostInventarioMP(InventarioMPDTO inventarioMPDTO)
        {
            var inventarioMP = new InventarioMP
            {
                IdMateriaPrima = inventarioMPDTO.IdMateriaPrima,
                UnidadMedida = inventarioMPDTO.UnidadMedida,
                Cantidad = inventarioMPDTO.Cantidad,
                IdCompra = inventarioMPDTO.IdCompra,
                Caducidad = inventarioMPDTO.Caducidad,
                Estatus = inventarioMPDTO.Estatus,
                CreatedAt = inventarioMPDTO.CreatedAt ?? DateTime.Now
            };

            _context.InventarioMPs.Add(inventarioMP);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInventarioMP", new { id = inventarioMP.Id }, inventarioMP);
        }

        // DELETE: api/InventarioMP/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventarioMP(int id)
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

        private bool InventarioMPExists(int id)
        {
            return _context.InventarioMPs.Any(e => e.Id == id);
        }
    }
}
