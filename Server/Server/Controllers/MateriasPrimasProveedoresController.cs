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
    public class MateriasPrimasProveedoresController : ControllerBase
    {
        private readonly Context _context;

        public MateriasPrimasProveedoresController(Context context)
        {
            _context = context;
        }

        // GET: api/MateriaPrimaProveedor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MateriaPrimaProveedor>>> GetMateriaPrimaProveedores()
        {
            return await _context.MateriaPrimaProveedores.ToListAsync();
        }

        // GET: api/MateriaPrimaProveedor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MateriaPrimaProveedor>> GetMateriaPrimaProveedor(int id)
        {
            var materiaPrimaProveedor = await _context.MateriaPrimaProveedores.FindAsync(id);

            if (materiaPrimaProveedor == null)
            {
                return NotFound();
            }

            return materiaPrimaProveedor;
        }

        // PUT: api/MateriaPrimaProveedor/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMateriaPrimaProveedor(int id, MateriaPrimaProveedorDTO materiaPrimaProveedorDTO)
        {
            if (id != materiaPrimaProveedorDTO.Id)
            {
                return BadRequest();
            }

            var materiaPrimaProveedor = await _context.MateriaPrimaProveedores.FindAsync(id);
            if (materiaPrimaProveedor == null)
            {
                return NotFound();
            }

            materiaPrimaProveedor.MateriaPrimaId = materiaPrimaProveedorDTO.MateriaPrimaId;
            materiaPrimaProveedor.ProveedorId = materiaPrimaProveedorDTO.ProveedorId;

            _context.Entry(materiaPrimaProveedor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MateriaPrimaProveedorExists(id))
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

        // POST: api/MateriaPrimaProveedor
        [HttpPost]
        public async Task<ActionResult<MateriaPrimaProveedor>> PostMateriaPrimaProveedor(MateriaPrimaProveedorDTO materiaPrimaProveedorDTO)
        {
            var materiaPrimaProveedor = new MateriaPrimaProveedor
            {
                MateriaPrimaId = materiaPrimaProveedorDTO.MateriaPrimaId,
                ProveedorId = materiaPrimaProveedorDTO.ProveedorId
            };

            _context.MateriaPrimaProveedores.Add(materiaPrimaProveedor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMateriaPrimaProveedor", new { id = materiaPrimaProveedor.Id }, materiaPrimaProveedor);
        }

        // DELETE: api/MateriaPrimaProveedor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMateriaPrimaProveedor(int id)
        {
            var materiaPrimaProveedor = await _context.MateriaPrimaProveedores.FindAsync(id);
            if (materiaPrimaProveedor == null)
            {
                return NotFound();
            }

            _context.MateriaPrimaProveedores.Remove(materiaPrimaProveedor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MateriaPrimaProveedorExists(int id)
        {
            return _context.MateriaPrimaProveedores.Any(e => e.Id == id);
        }
    }
}
