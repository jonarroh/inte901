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
    public class InventarioMPsController : ControllerBase
    {
        private readonly Context _context;

        public InventarioMPsController(Context context)
        {
            _context = context;
        }

        // GET: api/InventarioMP
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventarioMPDTO>>> GetInventarioMPs()
        {
            var inventarioMPs = await _context.InventarioMPs
                .Select(im => new InventarioMPDTO
                {
                    Id = im.Id,
                    IdMateriaPrima = im.IdMateriaPrima,
                    UnidadMedida = im.UnidadMedida,
                    Cantidad = im.Cantidad,
                    IdCompra = im.IdCompra,
                    Caducidad = im.Caducidad,
                    Estatus = im.Estatus,
                    CreatedAt = im.CreatedAt
                })
                .ToListAsync();

            return Ok(inventarioMPs);
        }

        // GET: api/InventarioMP/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventarioMPDTO>> GetInventarioMP(int id)
        {
            var inventarioMP = await _context.InventarioMPs
                .Where(im => im.Id == id)
                .Select(im => new InventarioMPDTO
                {
                    Id = im.Id,
                    IdMateriaPrima = im.IdMateriaPrima,
                    UnidadMedida = im.UnidadMedida,
                    Cantidad = im.Cantidad,
                    IdCompra = im.IdCompra,
                    Caducidad = im.Caducidad,
                    Estatus = im.Estatus,
                    CreatedAt = im.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (inventarioMP == null)
            {
                return NotFound();
            }

            return Ok(inventarioMP);
        }

        // PUT: api/InventarioMP/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventarioMP(int id, InventarioMPDTO inventarioMPDto)
        {
            if (id != inventarioMPDto.Id)
            {
                return BadRequest();
            }

            var inventarioMP = await _context.InventarioMPs.FindAsync(id);

            if (inventarioMP == null)
            {
                return NotFound();
            }

            inventarioMP.IdMateriaPrima = inventarioMPDto.IdMateriaPrima;
            inventarioMP.UnidadMedida = inventarioMPDto.UnidadMedida;
            inventarioMP.Cantidad = inventarioMPDto.Cantidad;
            inventarioMP.IdCompra = inventarioMPDto.IdCompra;
            inventarioMP.Caducidad = inventarioMPDto.Caducidad;
            inventarioMP.Estatus = inventarioMPDto.Estatus;
            inventarioMP.CreatedAt = inventarioMPDto.CreatedAt;

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
        public async Task<ActionResult<InventarioMPDTO>> PostInventarioMP(InventarioMPDTO inventarioMPDto)
        {
            var inventarioMP = new InventarioMP
            {
                IdMateriaPrima = inventarioMPDto.IdMateriaPrima,
                UnidadMedida = inventarioMPDto.UnidadMedida,
                Cantidad = inventarioMPDto.Cantidad,
                IdCompra = inventarioMPDto.IdCompra,
                Caducidad = inventarioMPDto.Caducidad,
                Estatus = inventarioMPDto.Estatus,
                CreatedAt = inventarioMPDto.CreatedAt
            };

            _context.InventarioMPs.Add(inventarioMP);
            await _context.SaveChangesAsync();

            inventarioMPDto.Id = inventarioMP.Id;

            return CreatedAtAction("GetInventarioMP", new { id = inventarioMPDto.Id }, inventarioMPDto);
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
