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

        // GET: api/MateriasPrimasProveedores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MateriaPrimaProveedorDTO>>> GetMateriasPrimasProveedores()
        {
            var materiasPrimasProveedores = await _context.MateriaPrimaProveedores
                .Select(mpp => new MateriaPrimaProveedorDTO
                {
                    Id = mpp.Id,
                    MateriaPrimaId = mpp.MateriaPrimaId,
                    ProveedorId = mpp.ProveedorId
                })
                .ToListAsync();

            return Ok(materiasPrimasProveedores);
        }

        // GET: api/MateriasPrimasProveedores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MateriaPrimaProveedorDTO>> GetMateriaPrimaProveedor(int id)
        {
            var materiaPrimaProveedor = await _context.MateriaPrimaProveedores
                .Where(mpp => mpp.Id == id)
                .Select(mpp => new MateriaPrimaProveedorDTO
                {
                    Id = mpp.Id,
                    MateriaPrimaId = mpp.MateriaPrimaId,
                    ProveedorId = mpp.ProveedorId
                })
                .FirstOrDefaultAsync();

            if (materiaPrimaProveedor == null)
            {
                return NotFound();
            }

            return Ok(materiaPrimaProveedor);
        }

        // PUT: api/MateriasPrimasProveedores/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMateriaPrimaProveedor(int id, MateriaPrimaProveedorDTO materiaPrimaProveedorDto)
        {
            if (id != materiaPrimaProveedorDto.Id)
            {
                return BadRequest();
            }

            var materiaPrimaProveedor = await _context.MateriaPrimaProveedores.FindAsync(id);

            if (materiaPrimaProveedor == null)
            {
                return NotFound();
            }

            materiaPrimaProveedor.MateriaPrimaId = materiaPrimaProveedorDto.MateriaPrimaId;
            materiaPrimaProveedor.ProveedorId = materiaPrimaProveedorDto.ProveedorId;

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

        // POST: api/MateriasPrimasProveedores
        [HttpPost]
        public async Task<ActionResult<MateriaPrimaProveedorDTO>> PostMateriaPrimaProveedor(MateriaPrimaProveedorDTO materiaPrimaProveedorDto)
        {
            var materiaPrimaProveedor = new MateriaPrimaProveedor
            {
                MateriaPrimaId = materiaPrimaProveedorDto.MateriaPrimaId,
                ProveedorId = materiaPrimaProveedorDto.ProveedorId
            };

            _context.MateriaPrimaProveedores.Add(materiaPrimaProveedor);
            await _context.SaveChangesAsync();

            materiaPrimaProveedorDto.Id = materiaPrimaProveedor.Id;

            return CreatedAtAction("GetMateriaPrimaProveedor", new { id = materiaPrimaProveedorDto.Id }, materiaPrimaProveedorDto);
        }

        // DELETE: api/MateriasPrimasProveedores/5
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
