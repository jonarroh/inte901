using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server;
using Server.Models;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("[controller]")]
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
        //[Authorize]
        [Route("allOrders")]
        public async Task<IActionResult> GetOrders()
        {
            try
            {
                var ordenes = await _context.Orders.ToListAsync();

                Random rnd = new Random();
                int ticket = rnd.Next(10000000, 99999999);

                //if (ordenes == null || ordenes.Count() == 0)
                //{
                //    return BadRequest("No hay ordenes registradas");
                //}

                return Ok(ticket);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET: api/Orders/5
        [HttpGet]
        //[Authorize]
        [Route("oneOrder/{id}")]
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

        [HttpGet]
        //[Authorize]
        [Route("orderDetail/{id}")]
        public async Task<IActionResult> GetDetail(int? id)
        {
            try
            {
                var detail = await _context.DetailOrders.FindAsync(id);

                return Ok(detail);
            }
            catch (Exception ex)
            {
                return NotFound($"{ex.Message}");
            }
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        //[Authorize]
        [Route("updateOrder/{id}")]
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
        //[Authorize]
        [Route("addOrder")]
        public async Task<IActionResult> PostOrder(OrderDTO ordertdo)
        {
            try
            {
                Random rnd = new Random();
                int ticket;
                bool ticketExists;

                do
                {
                    ticket = rnd.Next(10000000, 99999999);
                    ticketExists = await _context.DetailOrders.AnyAsync(d => d.Ticket == ticket);
                } while (ticketExists);

                var orden = new Order
                {
                    OrderDate = DateTime.Now,
                    IdClient = ordertdo.IdClient,
                    IdUser = 1,
                    Total = ordertdo.Total,
                };

                //await _context.Orders.AddAsync(orden);
                //await _context.SaveChangesAsync();

                var detail = new DetailOrder
                {
                    IdOrder = ordertdo.IdOrder,
                    IdProduct = ordertdo.IdProduct,
                    NameProduct = ordertdo.NameProduct,
                    Quantity = ordertdo.Quantity,
                    PriceSingle = ordertdo.PriceSingle,
                    DateOrder = orden.OrderDate,
                    Ticket = ticket,
                };

                //await _context.DetailOrders.AddAsync(detail);
                //await _context.SaveChangesAsync();

                Console.WriteLine($"{orden.Id}, {orden.IdClient}, {orden.IdUser}, {orden.Total}");
                Console.WriteLine($"{detail.IdOrder}, {detail.NameProduct}, {detail.Ticket}");
                return Ok($"Orden creada correctamente");
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // DELETE: api/Orders/5
        [HttpDelete]
        //[Authorize]
        [Route("deleteOrder/{id}")]
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
