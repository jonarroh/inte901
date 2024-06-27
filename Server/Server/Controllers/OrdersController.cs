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
    public class OrdersController : ControllerBase
    {
        private readonly Context _context;

        public OrdersController(Context context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        [Route("allOrders")]
        public async Task<IActionResult> GetOrders()
        {
            try
            {
                var ordenes = await _context.Orders.ToListAsync();

                if (ordenes == null)
                {
                    return BadRequest("No hay ordenes registradas");
                }

                return Ok(ordenes);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        [Route("oneOrder")]
        public async Task<IActionResult> GetOrder(int? id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);

                if (order == null)
                {
                    return BadRequest("No existe la orden");
                }

                return Ok(order);
            } catch(Exception ex)
            {
                return NotFound($"{ex.Message}");
            }
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Route("updateOrder")]
        public async Task<IActionResult> PutOrder(int? id, [FromBody] Order order)
        {
            try
            {
                var orden = await _context.Orders.FindAsync(id);

                if (orden == null)
                {
                    return BadRequest("No existe la orden");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
            //if (id != order.Id)
            //{
            //    return BadRequest();
            //}

            //_context.Entry(order).State = EntityState.Modified;

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!OrderExists(id))
            //    {
            //        return NotFound();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}
        }

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("addOrder")]
        public async Task<IActionResult> PostOrder([FromBody]  OrderDTO ordertdo)
        {
            try
            {
                if (ordertdo == null)
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            return Ok($"Orden creada correctamente, {ordertdo.NameProduct}");
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        [Route("deleteOrder")]
        public async Task<IActionResult> DeleteOrder(int? id)
        {
            try
            {
                var orden = _context.Orders.FindAsync(id);

                if (orden == null)
                {
                    return BadRequest("No existe la orden");
                }

                return NoContent() ;
            }
            catch(Exception ex)
            {
                return NotFound(ex.Message);
            }
            //var order = await _context.Orders.FindAsync(id);
            //if (order == null)
            //{
            //    return NotFound();
            //}

            //_context.Orders.Remove(order);
            //await _context.SaveChangesAsync();
        }

        private bool OrderExists(int? id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
