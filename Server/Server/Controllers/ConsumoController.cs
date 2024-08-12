using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;
using Server;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsumoController : ControllerBase
    {
        private readonly Context _context;

        public ConsumoController(Context context)
        {
            _context = context;
        }

        // GET: api/Consumo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Consumo>>> GetConsumo()
        {

           var consumos = await _context.Consumo.ToListAsync();

            foreach (var consumo in consumos)
            {
                consumo.DetailConsumo = await _context.DetailConsumo.Where(x => x.IdConsumo == consumo.Id).ToListAsync();

                var reserva = await _context.Reservas.FindAsync(consumo.IdReserva);
                if (reserva != null)
                {
                    consumo.Reserva = reserva;

                    var usuario = await _context.Users.FindAsync(reserva.idCliente);
                    if (usuario != null)
                    {
                        reserva.Usuario = usuario;
                    }
                    var detailReserva = await _context.DetailReservas.FindAsync(reserva.idDetailReser);
                    if (detailReserva != null)
                    {
                        reserva.DetailReserva = detailReserva;
                    }

                }

                foreach (var detail in consumo.DetailConsumo) {

                    var product = await _context.Productos.FindAsync(detail.IdProduct);
                    if (product != null)
                    {
                        detail.Product = product;

                    }
                }
            }

            return consumos;
        }
        [HttpPost("{idConsumo}/addDetails")]
        public async Task<ActionResult> AddDetailsToConsumo(int idConsumo, List<DetailConsumoDTO> detailConsumoDTOs)
        {
            // Buscar el consumo existente
            var consumo = await _context.Consumo.Include(c => c.DetailConsumo).FirstOrDefaultAsync(c => c.Id == idConsumo);
            if (consumo == null)
            {
                return NotFound();
            }

            // Crear y agregar los nuevos detalles al consumo
            var newDetails = detailConsumoDTOs.Select(d => new DetailConsumo
            {
                Quantity = d.Quantity,
                PriceSingle = d.PriceSingle,
                Status = d.Status,
                IdConsumo = idConsumo,
                IdProduct = d.IdProduct
            }).ToList();

            consumo.DetailConsumo.AddRange(newDetails);

            // Guardar los cambios en la base de datos
            _context.DetailConsumo.AddRange(newDetails);
            await _context.SaveChangesAsync();

            return Ok();
        }


        // GET: api/Consumo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Consumo>> GetConsumo(int id)
        {
            var consumo = await _context.Consumo.FindAsync(id);

            if (consumo == null)
            {
                return NotFound();
            }

            return consumo;
        }

        // PUT: api/Consumo/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsumo(int id, consumoDTO consumo)
        {
            if (id != consumo.Id)
            {
                return BadRequest();
            }

            _context.Entry(consumo).State = EntityState.Modified;

            try
            {

                Consumo c = new Consumo();
                c.Id = id;
                c.IdReserva = consumo.IdReserva;
                c.Status = consumo.Status;
                c.Total = consumo.Total;
                c.Status = consumo.Status;
                c.DetailConsumo = await _context.DetailConsumo.Where(x => x.IdConsumo == consumo.Id).ToListAsync();
                var res = await _context.Reservas.FindAsync(consumo.IdReserva);
                if (res == null)
                {

                    return NotFound();
                }

                c.Reserva = res;
    
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsumoExists(id))
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

        // POST: api/Consumo
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Consumo>> PostConsumo(consumoDTO consumoDto)
        {
            // Crear y asignar las propiedades del objeto Consumo
            Consumo consumo = new Consumo
            {
                IdReserva = consumoDto.IdReserva,
                Total = consumoDto.Total,
                Status = "Activo" // Asignar el estado "Activo"
            };

            // Buscar la reserva asociada
            var reserva = await _context.Reservas.FindAsync(consumo.IdReserva);
            if (reserva == null)
            {
                return NotFound();
            }

            // Asignar la reserva al consumo
            consumo.Reserva = reserva;

            // Agregar el consumo al contexto y guardar los cambios para obtener el ID generado
            _context.Consumo.Add(consumo);
            await _context.SaveChangesAsync();

            // Asignar y guardar los detalles del consumo
            consumo.DetailConsumo = consumoDto.DetailConsumo.Select(d => new DetailConsumo
            {
                Quantity = d.Quantity,
                PriceSingle = d.PriceSingle,
                Status = d.Status,
                IdConsumo = consumo.Id,
                IdProduct = d.IdProduct
            }).ToList();

            // Agregar los detalles del consumo al contexto y guardar los cambios
            _context.DetailConsumo.AddRange(consumo.DetailConsumo);
            await _context.SaveChangesAsync();

            // Devolver la respuesta con el consumo creado
            return CreatedAtAction("GetConsumo", new { id = consumo.Id }, consumo);
        }



        // DELETE: api/Consumo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsumo(int id)
        {
            var consumo = await _context.Consumo.FindAsync(id);
            if (consumo == null)
            {
                return NotFound();
            }

            _context.Consumo.Remove(consumo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsumoExists(int id)
        {
            return _context.Consumo.Any(e => e.Id == id);
        }
    }
}
