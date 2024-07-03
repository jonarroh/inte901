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
    public class MateriasPrimasController : ControllerBase
    {
        private readonly Context _context;

        public MateriasPrimasController(Context context)
        {
            _context = context;
        }

        // GET: api/MateriasPrimas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MateriaPrimaDTO>>> GetMateriasPrimas()
        {
            var materiasPrimas = await _context.MateriasPrimas
                .Select(mp => new MateriaPrimaDTO
                {
                    Id = mp.Id,
                    Material = mp.Material,
                    Estatus = mp.Estatus,
                    CreatedAt = mp.CreatedAt,
                    UpdatedAt = mp.UpdatedAt,
                    DeletedAt = mp.DeletedAt
                })
                .ToListAsync();

            return Ok(materiasPrimas);
        }

        // GET: api/MateriasPrimas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MateriaPrimaDTO>> GetMateriaPrima(int id)
        {
            var materiaPrima = await _context.MateriasPrimas
                .Where(mp => mp.Id == id)
                .Select(mp => new MateriaPrimaDTO
                {
                    Id = mp.Id,
                    Material = mp.Material,
                    Estatus = mp.Estatus,
                    CreatedAt = mp.CreatedAt,
                    UpdatedAt = mp.UpdatedAt,
                    DeletedAt = mp.DeletedAt
                })
                .FirstOrDefaultAsync();

            if (materiaPrima == null)
            {
                return NotFound();
            }

            return Ok(materiaPrima);
        }

        // PUT: api/MateriasPrimas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMateriaPrima(int id, MateriaPrimaDTO materiaPrimaDto)
        {
            if (id != materiaPrimaDto.Id)
            {
                return BadRequest();
            }

            var materiaPrima = await _context.MateriasPrimas.FindAsync(id);

            if (materiaPrima == null)
            {
                return NotFound();
            }

            materiaPrima.Material = materiaPrimaDto.Material;
            materiaPrima.Estatus = materiaPrimaDto.Estatus;
            materiaPrima.CreatedAt = materiaPrimaDto.CreatedAt;
            materiaPrima.UpdatedAt = DateTime.Now;
            materiaPrima.DeletedAt = materiaPrimaDto.DeletedAt;

            _context.Entry(materiaPrima).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MateriaPrimaExists(id))
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

        // POST: api/MateriasPrimas
        [HttpPost]
        public async Task<ActionResult<MateriaPrimaDTO>> PostMateriaPrima(MateriaPrimaDTO materiaPrimaDto)
        {
            var materiaPrima = new MateriaPrima
            {
                Material = materiaPrimaDto.Material,
                Estatus = materiaPrimaDto.Estatus,
                CreatedAt = DateTime.Now,
                UpdatedAt = materiaPrimaDto.UpdatedAt,
                DeletedAt = materiaPrimaDto.DeletedAt
            };

            _context.MateriasPrimas.Add(materiaPrima);
            await _context.SaveChangesAsync();

            materiaPrimaDto.Id = materiaPrima.Id;

            return CreatedAtAction("GetMateriaPrima", new { id = materiaPrimaDto.Id }, materiaPrimaDto);
        }

        // DELETE: api/MateriasPrimas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMateriaPrima(int id)
        {
            var materiaPrima = await _context.MateriasPrimas.FindAsync(id);

            if (materiaPrima == null)
            {
                return NotFound();
            }

            _context.MateriasPrimas.Remove(materiaPrima);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MateriaPrimaExists(int id)
        {
            return _context.MateriasPrimas.Any(e => e.Id == id);
        }
    }
}
