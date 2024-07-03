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
    public class IngredientesController : ControllerBase
    {
        private readonly Context _context;

        public IngredientesController(Context context)
        {
            _context = context;
        }

        // GET: api/Ingredientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IngredienteDTO>>> GetIngredientes()
        {
            var ingredientes = await _context.Ingredientes
                .Select(i => new IngredienteDTO
                {
                    Id = i.Id,
                    IdProducto = i.IdProducto,
                    IdMateriaPrima = i.IdMateriaPrima,
                    Cantidad = i.Cantidad,
                    UnidadMedida = i.UnidadMedida,
                    Estatus = i.Estatus,
                    CreatedAt = i.CreatedAt,
                    UpdatedAt = i.UpdatedAt,
                    DeletedAt = i.DeletedAt
                })
                .ToListAsync();

            return Ok(ingredientes);
        }

        // GET: api/Ingredientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IngredienteDTO>> GetIngrediente(int id)
        {
            var ingrediente = await _context.Ingredientes
                .Where(i => i.Id == id)
                .Select(i => new IngredienteDTO
                {
                    Id = i.Id,
                    IdProducto = i.IdProducto,
                    IdMateriaPrima = i.IdMateriaPrima,
                    Cantidad = i.Cantidad,
                    UnidadMedida = i.UnidadMedida,
                    Estatus = i.Estatus,
                    CreatedAt = i.CreatedAt,
                    UpdatedAt = i.UpdatedAt,
                    DeletedAt = i.DeletedAt
                })
                .FirstOrDefaultAsync();

            if (ingrediente == null)
            {
                return NotFound();
            }

            return Ok(ingrediente);
        }

        // PUT: api/Ingredientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIngrediente(int id, IngredienteDTO ingredienteDto)
        {
            if (id != ingredienteDto.Id)
            {
                return BadRequest();
            }

            var ingrediente = await _context.Ingredientes.FindAsync(id);

            if (ingrediente == null)
            {
                return NotFound();
            }

            ingrediente.IdProducto = ingredienteDto.IdProducto;
            ingrediente.IdMateriaPrima = ingredienteDto.IdMateriaPrima;
            ingrediente.Cantidad = ingredienteDto.Cantidad;
            ingrediente.UnidadMedida = ingredienteDto.UnidadMedida;
            ingrediente.Estatus = ingredienteDto.Estatus;
            ingrediente.CreatedAt = ingredienteDto.CreatedAt;
            ingrediente.UpdatedAt = DateTime.Now;
            ingrediente.DeletedAt = ingredienteDto.DeletedAt;

            _context.Entry(ingrediente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IngredienteExists(id))
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

        // POST: api/Ingredientes
        [HttpPost]
        public async Task<ActionResult<IngredienteDTO>> PostIngrediente(IngredienteDTO ingredienteDto)
        {
            var ingrediente = new Ingrediente
            {
                IdProducto = ingredienteDto.IdProducto,
                IdMateriaPrima = ingredienteDto.IdMateriaPrima,
                Cantidad = ingredienteDto.Cantidad,
                UnidadMedida = ingredienteDto.UnidadMedida,
                Estatus = ingredienteDto.Estatus,
                CreatedAt = DateTime.Now,
                UpdatedAt = ingredienteDto.UpdatedAt,
                DeletedAt = ingredienteDto.DeletedAt
            };

            _context.Ingredientes.Add(ingrediente);
            await _context.SaveChangesAsync();

            ingredienteDto.Id = ingrediente.Id;

            return CreatedAtAction("GetIngrediente", new { id = ingredienteDto.Id }, ingredienteDto);
        }

        // DELETE: api/Ingredientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIngrediente(int id)
        {
            var ingrediente = await _context.Ingredientes.FindAsync(id);

            if (ingrediente == null)
            {
                return NotFound();
            }

            _context.Ingredientes.Remove(ingrediente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IngredienteExists(int id)
        {
            return _context.Ingredientes.Any(e => e.Id == id);
        }
    }
}
