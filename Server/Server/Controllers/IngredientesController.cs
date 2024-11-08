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
    [Authorize]
    [ApiController]
    public class IngredientesController : ControllerBase
    {
        private readonly Context _context;

        public IngredientesController(Context context)
        {
            _context = context;
        }

        // GET: api/Ingrediente
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ingrediente>>> GetIngredientes()
        {
            return await _context.Ingredientes
                .Where(i => i.Estatus != 0) // Filtrar registros con Estatus != 0
                .ToListAsync();
        }

        // GET: api/Ingrediente/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ingrediente>> GetIngrediente(int id)
        {
            var ingrediente = await _context.Ingredientes
                .Where(i => i.Id == id && i.Estatus != 0) // Filtrar registros con Estatus != 0
                .FirstOrDefaultAsync();

            if (ingrediente == null)
            {
                return NotFound();
            }

            return ingrediente;
        }

        // GET: api/Ingrediente/ByProducto/{productoId}
        [HttpGet("ByProducto/{productoId}")]
        public async Task<ActionResult<IEnumerable<Ingrediente>>> GetIngredientesByProducto(int productoId)
        {
            var ingredientes = await _context.Ingredientes
                .Where(i => i.IdProducto == productoId && i.Estatus != 0) // Filtrar registros con Estatus != 0
                .ToListAsync();

            if (!ingredientes.Any())
            {
                return NotFound();
            }

            return ingredientes;
        }


        // PUT: api/Ingrediente/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIngrediente(int id, IngredienteDTO ingredienteDTO)
        {
            if (id != ingredienteDTO.Id)
            {
                return BadRequest();
            }

            var ingrediente = await _context.Ingredientes.FindAsync(id);
            if (ingrediente == null)
            {
                return NotFound();
            }

            ingrediente.IdProducto = ingredienteDTO.IdProducto;
            ingrediente.IdMateriaPrima = ingredienteDTO.IdMateriaPrima;
            ingrediente.Cantidad = ingredienteDTO.Cantidad;
            ingrediente.UnidadMedida = ingredienteDTO.UnidadMedida;
            ingrediente.Estatus = ingredienteDTO.Estatus;
            ingrediente.EnMenu = ingredienteDTO.EnMenu;
            ingrediente.UpdatedAt = ingredienteDTO.UpdatedAt;

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

        // POST: api/Ingrediente
        [HttpPost]
        public async Task<ActionResult<Ingrediente>> PostIngrediente(IngredienteDTO ingredienteDTO)
        {
            var ingrediente = new Ingrediente
            {
                IdProducto = ingredienteDTO.IdProducto,
                IdMateriaPrima = ingredienteDTO.IdMateriaPrima,
                Cantidad = ingredienteDTO.Cantidad,
                UnidadMedida = ingredienteDTO.UnidadMedida,
                Estatus = ingredienteDTO.Estatus,
                EnMenu = ingredienteDTO.EnMenu,
                CreatedAt = ingredienteDTO.CreatedAt ?? DateTime.Now
            };

            _context.Ingredientes.Add(ingrediente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIngrediente", new { id = ingrediente.Id }, ingrediente);
        }

        [HttpPost]
        [Route("Bulk")]
        public async Task<ActionResult<IEnumerable<Ingrediente>>> PostIngredientes(List<IngredienteDTO> ingredientesDTO)
        {
            var ingredientes = ingredientesDTO.Select(ingredienteDTO => new Ingrediente
            {
                IdProducto = ingredienteDTO.IdProducto,
                IdMateriaPrima = ingredienteDTO.IdMateriaPrima,
                Cantidad = ingredienteDTO.Cantidad,
                UnidadMedida = ingredienteDTO.UnidadMedida,
                Estatus = ingredienteDTO.Estatus,
                EnMenu = ingredienteDTO.EnMenu,
                CreatedAt = ingredienteDTO.CreatedAt ?? DateTime.Now
            });

            _context.Ingredientes.AddRange(ingredientes);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIngredientes", ingredientes);
        }



        // DELETE: api/Ingrediente/5
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
