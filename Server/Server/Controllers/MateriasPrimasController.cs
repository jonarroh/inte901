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

        // GET: api/MateriaPrima
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MateriaPrima>>> GetMateriasPrimas()
        {
            return await _context.MateriasPrimas.ToListAsync();
        }

        // GET: api/MateriaPrima/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MateriaPrima>> GetMateriaPrima(int id)
        {
            var materiaPrima = await _context.MateriasPrimas.FindAsync(id);

            if (materiaPrima == null)
            {
                return NotFound();
            }

            return materiaPrima;
        }

        // PUT: api/MateriaPrima/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMateriaPrima(int id, MateriaPrimaDTO materiaPrimaDTO)
        {
            if (id != materiaPrimaDTO.Id)
            {
                return BadRequest();
            }

            var materiaPrima = await _context.MateriasPrimas.FindAsync(id);
            if (materiaPrima == null)
            {
                return NotFound();
            }

            materiaPrima.Material = materiaPrimaDTO.Material;
            materiaPrima.Estatus = materiaPrimaDTO.Estatus;
            materiaPrima.UpdatedAt = materiaPrimaDTO.UpdatedAt ?? DateTime.Now;
            materiaPrima.DeletedAt = materiaPrimaDTO.DeletedAt;

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

        // POST: api/MateriaPrima
        [HttpPost]
        public async Task<ActionResult<MateriaPrima>> PostMateriaPrima(MateriaPrimaDTO materiaPrimaDTO)
        {
            var materiaPrima = new MateriaPrima
            {
                Material = materiaPrimaDTO.Material,
                Estatus = materiaPrimaDTO.Estatus,
                CreatedAt = materiaPrimaDTO.CreatedAt ?? DateTime.Now,
                UpdatedAt = materiaPrimaDTO.UpdatedAt,
                DeletedAt = materiaPrimaDTO.DeletedAt
            };

            _context.MateriasPrimas.Add(materiaPrima);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMateriaPrima", new { id = materiaPrima.Id }, materiaPrima);
        }

        // DELETE: api/MateriaPrima/5
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

        // POST: api/MateriaPrima/bulk
        [HttpPost]
        [Route("bulk")]
        public async Task<ActionResult<MateriaPrimaDTO[]>> PostMateriasPrimas(MateriaPrimaDTO[] materiasPrimas)
        {
            var materia = new List<MateriaPrima>();
            foreach (var materiaPrimaDTO in materiasPrimas)
            {
                var materiaPrima = new MateriaPrima
                {
                    Material = materiaPrimaDTO.Material,
                    Estatus = materiaPrimaDTO.Estatus,
                    CreatedAt = materiaPrimaDTO.CreatedAt ?? DateTime.Now,
                    UpdatedAt = materiaPrimaDTO.UpdatedAt,
                    DeletedAt = materiaPrimaDTO.DeletedAt
                };
                materia.Add(materiaPrima);
            }

            _context.MateriasPrimas.AddRange(materia);
            await _context.SaveChangesAsync();

            var materiasPrimasDTO = new List<MateriaPrimaDTO>();
            foreach (var materiaPrima in materiasPrimas)
            {
                materiasPrimasDTO.Add(new MateriaPrimaDTO
                {
                    Id = materiaPrima.Id,
                    Material = materiaPrima.Material,
                    Estatus = materiaPrima.Estatus,
                    CreatedAt = materiaPrima.CreatedAt,
                    UpdatedAt = materiaPrima.UpdatedAt,
                    DeletedAt = materiaPrima.DeletedAt
                });
            }

            return CreatedAtAction("GetMateriaPrima", materiasPrimasDTO);
        }

        private bool MateriaPrimaExists(int id)
        {
            return _context.MateriasPrimas.Any(e => e.Id == id);
        }
    }
}
