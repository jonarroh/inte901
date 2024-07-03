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

        // GET: api/InventarioPostres
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventarioPostreDTO>>> GetInventarioPostres()
        {
            var inventarioPostres = await _context.InventarioPostres
                .Select(ip => new InventarioPostreDTO
                {
                    IdPostre = ip.IdPostre,
                    IdProducto = ip.IdProducto,
                    Cantidad = ip.Cantidad,
                    Estatus = ip.Estatus,
                    CreatedAt = ip.CreatedAt
                })
                .ToListAsync();

            return Ok(inventarioPostres);
        }

        // GET: api/InventarioPostres/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventarioPostreDTO>> GetInventarioPostre(int id)
        {
            var inventarioPostre = await _context.InventarioPostres
                .Where(ip => ip.IdPostre == id)
                .Select(ip => new InventarioPostreDTO
                {
                    IdPostre = ip.IdPostre,
                    IdProducto = ip.IdProducto,
                    Cantidad = ip.Cantidad,
                    Estatus = ip.Estatus,
                    CreatedAt = ip.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (inventarioPostre == null)
            {
                return NotFound();
            }

            return Ok(inventarioPostre);
        }

        // PUT: api/InventarioPostres/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInventarioPostre(int id, InventarioPostreDTO inventarioPostreDto)
        {
            if (id != inventarioPostreDto.IdPostre)
            {
                return BadRequest();
            }

            var inventarioPostre = await _context.InventarioPostres.FindAsync(id);

            if (inventarioPostre == null)
            {
                return NotFound();
            }

            inventarioPostre.IdProducto = inventarioPostreDto.IdProducto;
            inventarioPostre.Cantidad = inventarioPostreDto.Cantidad;
            inventarioPostre.Estatus = inventarioPostreDto.Estatus;
            inventarioPostre.CreatedAt = inventarioPostreDto.CreatedAt;

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
        [HttpPost]
        public async Task<ActionResult<InventarioPostreDTO>> PostInventarioPostre(InventarioPostreDTO inventarioPostreDto)
        {
            var inventarioPostre = new InventarioPostre
            {
                IdProducto = inventarioPostreDto.IdProducto,
                Cantidad = inventarioPostreDto.Cantidad,
                Estatus = inventarioPostreDto.Estatus,
                CreatedAt = inventarioPostreDto.CreatedAt
            };

            _context.InventarioPostres.Add(inventarioPostre);
            await _context.SaveChangesAsync();

            inventarioPostreDto.IdPostre = inventarioPostre.IdPostre;

            return CreatedAtAction("GetInventarioPostre", new { id = inventarioPostreDto.IdPostre }, inventarioPostreDto);
        }

        // DELETE: api/InventarioPostres/5
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
