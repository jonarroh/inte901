using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Castle.Components.DictionaryAdapter.Xml;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Server;
using Server.Hubs;
using Server.lib;
using Server.Models;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly Context _context;

        private readonly CreditCardService _creditCardService;

        private IHubContext<OrderHub> _hubContext;
        public OrdersController(Context context, CreditCardService creditService, IHubContext<OrderHub> hubContext)
        {
            _context = context;
            _creditCardService = creditService;
            _hubContext = hubContext;
        }

        [HttpPut]
        [Route("updateStatus/{id}")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string newStatus)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound("Order not found");
            }

            order.Status = newStatus;
            await _context.SaveChangesAsync();

            var message = $"{order.Id}:{newStatus}";
            await _hubContext.Clients.All.SendAsync("ReceiveOrderUpdate", message);

            return Ok(order);
        }

        [HttpGet]
        [Route("allOrders")]
        public async Task<IActionResult> GetOrders()
        {
            try
            {
                var ordenes = await _context.Orders.ToListAsync();

                if (ordenes == null || !ordenes.Any())
                {
                    return BadRequest("No hay ordenes registradas");
                }

                var ordenesPendientes = new List<Order>();

                foreach (var orden in ordenes)
                {
                    // Obtener la fecha del detalle de la orden de forma asíncrona
                    var dateOrder = await _context.DetailOrders
                        .Where(d => d.IdOrder == orden.Id)
                        .ToListAsync();

                   
                    // Asignar la fecha al campo correspondiente
                    orden.OrderDate = dateOrder != null ? new DateTime() : dateOrder.FirstOrDefault().DateOrder;

                    // Agregar la orden a la lista
                    ordenesPendientes.Add(orden);
                }

                return Ok(ordenesPendientes);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Se produjo un error en el servidor, contacte a soporte");
            }
        }

        [HttpGet]
        [Route("ordersByUser/{userId}")]
        public async Task<IActionResult> GetAllByIdUser(long userId)
        {
            try
            {
                // Obtén todas las órdenes del usuario específico
                var ordenes = await _context.Orders
                    .Where(o => o.IdUser == userId)
                    .ToListAsync();

                if (ordenes == null || !ordenes.Any())
                {
                    return NotFound("No hay órdenes registradas para el usuario especificado");
                }

                var ordenesPendientes = new List<Order>();

                foreach (var orden in ordenes)
                {
                    // Obtener la fecha del detalle de la orden de forma asíncrona
                    var dateOrder = await _context.DetailOrders
                        .Where(d => d.IdOrder == orden.Id)
                        .ToListAsync();

                    // Asignar la fecha al campo correspondiente
                    orden.OrderDate = dateOrder != null ? new DateTime() : dateOrder.FirstOrDefault().DateOrder;

                    // Agregar la orden a la lista
                    ordenesPendientes.Add(orden);
                }

                return Ok(ordenesPendientes);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Se produjo un error en el servidor, contacte a soporte");
            }
        }




        [HttpGet]
        //[Authorize]
        [Route("orderFilterByStatus/{status}")]
        public async Task<IActionResult> GetOrderByStatus(string? status)
        {
            try
            {
                var ordenes = await _context.Orders.Where(o => o.Status == status).ToListAsync();

                if (ordenes == null)
                {
                    return BadRequest($"No hay ordenes tipo: - {status} -");
                }

                return Ok(ordenes);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpGet]
        //[Authorize]
        [Route("oneOrder/{ticket},{id}")]
        public async Task<IActionResult> GetOrder(long? ticket, int? id)
        {
            try
            {
                var order = await _context.Orders.FirstOrDefaultAsync(o => o.Ticket == ticket && o.Id == id);

                if (order == null)
                {
                    return BadRequest("No existe la orden");
                }

                if (order.Status != "Pendiente")
                {
                    return BadRequest("La orden ya fue atendida.");
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPost]
        // [Authorize]
        [Route("addOrder")]
        public async Task<IActionResult> PostOrder(OrderDTO ordertdo)
        {
            try
            {
                if (ordertdo == null)
                {
                    return BadRequest("Campos incompletos, es necesario completar todos los datos.");
                }

                Random rnd = new Random();
                int ticket;
                bool ticketExists;
                string responseStatus;

                do
                {
                    ticket = rnd.Next(10000000, 99999999);
                    ticketExists = await _context.Orders.AnyAsync(d => d.Ticket == ticket);
                } while (ticketExists);

                var orden = new Order
                {
                    IdClient = ordertdo.IdClient,
                    IdUser = ordertdo.IdUser,
                    Total = ordertdo.Total,
                    OrderDate = DateTime.Now,
                    Status = "Ordenado",
                    Ticket = ticket,
                };

                // Validación y guardado de la dirección solo si es una entrega
                if (ordertdo.IsDeliver == true)
                {
                    var tarjeta = await _context.CreditCard.FindAsync(ordertdo.IdUser);

                    if (_creditCardService.IsValidCreditCard(tarjeta))
                    {
                        decimal amount = (decimal)orden.Total;

                        if (_creditCardService.CardCanPay(tarjeta, amount))
                        {
                            var direccion = new Direcciones
                            {
                                Calle = ordertdo.Direcciones.Calle,
                                NumeroExterior = ordertdo.Direcciones.NumeroExterior,
                                Estatus = "Activo",
                                Colonia = ordertdo.Direcciones.Colonia,
                                Ciudad = ordertdo.Direcciones.Ciudad,
                                Estado = ordertdo.Direcciones.Estado,
                                Pais = ordertdo.Direcciones.Pais,
                                CodigoPostal = ordertdo.Direcciones.CodigoPostal,
                                UserId = ordertdo.IdUser,
                            };

                            await _context.Direcciones.AddAsync(direccion);
                        }
                        else
                        {
                            return BadRequest("No hay suficiente saldo en la tarjeta.");
                        }
                    }
                    else
                    {
                        return BadRequest("La tarjeta no es válida.");
                    }
                }

                await _context.Orders.AddAsync(orden);
                await _context.SaveChangesAsync();

                // Guardado de los detalles de la orden
                foreach (var d in ordertdo.DetailOrders)
                {
                    var detail = new DetailOrder
                    {
                        IdOrder = orden.Id,
                        IdProduct = d.IdProduct,
                        Quantity = d.Quantity,
                        PriceSingle = d.PriceSingle,
                        DateOrder = DateTime.Now,
                        Ingredients = d.Ingredients,
                        Status = "Pendiente"
                    };

                    orden.DetailOrders?.Add(detail);
                    await _context.DetailOrders.AddAsync(detail);
                }

                await _context.SaveChangesAsync();

                // Petición para generar el QR después de guardar la orden y sus detalles
                using (HttpClient client = new HttpClient())
                {
                    var data = new Dictionary<string, string?>
            {
                { "id", orden.Id.ToString() },
                { "ticket", orden.Ticket.ToString() },
            };

                    var content = new FormUrlEncodedContent(data);

                    Console.WriteLine($"Se genero el QR, {data["id"]}, {data["ticket"]}");

                    HttpResponseMessage response = await client.PostAsync("http://localhost:5000/generate_qr_order", content);

                    if (response.IsSuccessStatusCode)
                    {
                        responseStatus = response.StatusCode.ToString();
                        Console.WriteLine(response.Content);
                    }
                    else
                    {
                        responseStatus = response.StatusCode.ToString();
                        Console.WriteLine(response.Content);
                        return NotFound($"Error con el QR, status: {responseStatus}");
                    }
                }

                return Ok(orden);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound("Se produjo un error en el servidor, contacte a soporte");
                // return NotFound(ex.Message);
            }
        }


        [HttpPut]
        //[Authorize]
        [Route("eliminarOrden/{id}")]
        public async Task<IActionResult> DeleteOrder(int? id)
        {
            try
            {
                var orden = await _context.Orders.FindAsync(id);
                var detailOrden = await _context.DetailOrders.Where(d => d.IdOrder == orden.Id).ToListAsync();

                if (orden == null)
                {
                    return BadRequest("No se encontro ninguna orden");
                }

                foreach (var detail in detailOrden)
                {
                    detail.Status = "Cancelado";
                }

                orden.Status = "Cancelado";

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPut]
        //[Authorize]
        [Route("completarOrden/{id}")]
        public async Task<IActionResult> CompleteOrder(int? id)
        {
            try
            {
                var orden = await _context.Orders.FindAsync(id);
                var detailOrden = await _context.DetailOrders.Where(d => d.IdOrder == orden.Id).ToListAsync();

                if (orden == null)
                {
                    return BadRequest("No existe la orden");
                }

                foreach (var detail in detailOrden)
                {
                    detail.Status = "Vendido";
                }

                orden.Status = "Vendido";

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPut]
        //[Authorize]
        [Route("deleteProductFromOrder")]
        public async Task<IActionResult> DeleteProductFromOrder([FromBody] JObject data)
        {
            try
            {
                int idOrder = data["id"].ToObject<int>();
                int idProduct = data["idProduct"].ToObject<int>();

                var orden = await _context.Orders.FindAsync(idOrder);
                var detailOrder = await _context.DetailOrders.Where(d => d.IdOrder == orden.Id).ToListAsync();

                foreach (var detail in detailOrder)
                {
                    if (detail.IdProduct == idProduct)
                    {
                        detail.Status = "Cancelado";

                        await _context.SaveChangesAsync();
                    }
                }

                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPost]
        // [Authorize]
        [Route("addProductToOrder")]
        public async Task<IActionResult> AddProductToOrder(DetailOrderDTO detaildto)
        {
            try
            {
                var orden = await _context.Orders.FindAsync(detaildto.IdOrder);
                var product = new DetailOrder
                {
                    IdOrder = orden.Id,
                    IdProduct = detaildto.IdProduct,
                    Quantity = detaildto.Quantity,
                    PriceSingle = detaildto.PriceSingle,
                    DateOrder = DateTime.Now,
                    Ingredients = detaildto.Ingredients,
                    Status = "Pendiente"
                };

                await _context.DetailOrders.AddAsync(product);

                Console.WriteLine($"Se guaradaron los cambios, {product.Id}, {product.IdProduct}, {product.Order}");

                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPut]
        // [Authorize]
        [Route("updateProductoFromOrder/{idDetail}")]
        public async Task<IActionResult> UpdateProductFromOrder(int? idDetail, [FromBody] DetailOrderDTO detaildto)
        {
            try
            {
                var detailOrden = await _context.DetailOrders.FindAsync(idDetail);

                detailOrden.IdProduct = detaildto.IdProduct;
                detailOrden.Quantity = detaildto.Quantity;
                detailOrden.DateOrder = DateTime.Now;
                detailOrden.Ingredients = detaildto.Ingredients;

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }

        private bool OrderExists(int? id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
}
