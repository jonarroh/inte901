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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Server;
using Server.Hubs;
using Server.lib;
using Server.Models;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    //[Authorize]
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

        [HttpGet]
        [Route("getOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _context.Orders.OrderByDescending(o => o.OrderDate).ToListAsync();

                if (orders == null || orders.Count == 0)
                {
					return BadRequest("No hay ordenes registradas");
				}

                return Ok(orders);
            } catch (Exception ex)
            {
				//Console.WriteLine(ex.Message);

				return NotFound("Se produjo un error en el servidor, contacte a soporte");
			}
        }

        [HttpGet]
        // [Authorize]
        [Route("getOrdersDelivery")]
        public async Task<IActionResult> GetOrdersDelivery()
        {
            try
            {
                var orders = await _context.Orders.Where(o => o.IsDeliver == true).OrderByDescending(o => o.OrderDate).ToListAsync();

                foreach (var order in orders)
                {
                    var details = await _context.DetailOrders.Where(d => d.IdOrder == order.Id).ToListAsync();
                    order.DetailOrders = details;
                    foreach (var detail in details)
                    {
                        var product = await _context.Productos.FindAsync(detail.IdProduct);
                        detail.Product = product;
                    }

                    var user = await _context.Users.FindAsync(order.IdClient);
                    order.User = user;
                }


                if (orders == null || orders.Count == 0)
                {
                    return BadRequest("No hay ordenes registradas");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }

        [HttpGet]
        // [Authorize]
        [Route("getOrdersNoDelivery")]
        public async Task<IActionResult> GetOrdersNoDelivery()
        {
            try
            {
                var orders = await _context.Orders.Where(o => o.IsDeliver == false).ToListAsync();

                if (orders == null || orders.Count == 0)
                {
                    return BadRequest("No hay ordenes registradas");
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
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

            var message = $"{order.Id}:{newStatus},{order.IdClient}";
            await _hubContext.Clients.All.SendAsync("ReceiveOrderUpdate", message);

            return Ok(order);
        }

        [HttpPut]
        [Route("updateStatusOrder/{status},{idOrder}")]
        public async Task<IActionResult> UpdateStatusOrder(string status, int idOrder)
        {
			try
            {
				var order = await _context.Orders.FindAsync(idOrder);

				if (order == null)
                {
					return NotFound("No se encontro la orden");
				}

				order.Status = status;

				await _context.SaveChangesAsync();

				return Ok(order);
			}
			catch (Exception ex)
            {
				//Console.WriteLine(ex.Message);

				return NotFound("Se produjo un error en el servidor, contacte a soporte");
			}
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

                    orden.OrderDate = DateTime.Parse(orden.OrderDate.ToString() ?? "");
                
                    // Agregar la orden a la lista
                    ordenesPendientes.Add(orden);
                }

                return Ok(ordenesPendientes);
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);
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
                    .Where(o => o.IdClient == userId)
                    .ToListAsync();

                if (ordenes == null || !ordenes.Any())
                {
                    return NotFound("No hay órdenes registradas para el usuario especificado");
                }

                var ordenesPendientes = new List<Order>();
                var products = await _context.Productos.ToListAsync();

                foreach (var orden in ordenes)
                {
                    // Obtener los detalles de la orden de forma asíncrona
                    var detailOrders = await _context.DetailOrders
                        .Where(d => d.IdOrder == orden.Id)
                        .ToListAsync();

                    // Asignar la fecha más reciente del detalle de la orden al campo correspondiente
                    if (detailOrders.Any())
                    {
                        orden.OrderDate = detailOrders.Max(d => d.DateOrder);
                    }

                    foreach (var detail in detailOrders)
                    {
                        // Obtener el producto correspondiente al detalle de la orden
                        var product = products.FirstOrDefault(p => p.Id == detail.IdProduct);

                        // Asignar el producto al detalle de la orden
                        detail.Product = product;
                    }

                    // Agregar la orden a la lista
                    ordenesPendientes.Add(orden);
                }

                // Ordenar las órdenes por fecha de forma descendente (más recientes primero)
                ordenesPendientes = ordenesPendientes.OrderByDescending(o => o.OrderDate).ToList();

                return Ok(ordenesPendientes);
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);
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
                //Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        
        private async Task<String> ProductInInventory(int idProduct, int quantity)
        {
            var product = await _context.Productos.Include(p => p.Ingredientes).FirstOrDefaultAsync(p => p.Id == idProduct);
            if (product == null)
            {
                return "Producto no encontrado";
            }

            if (IsSpecialProduct(idProduct))
            {
                return await CheckCakeInventory(product, quantity);
            }
            else
            {
                return await CheckIngredientsInventory(product, quantity);
            }
        }

        private bool IsSpecialProduct(int productId)
        {
            return productId == 1 || productId == 2;
        }

        private async Task<String> CheckCakeInventory(Producto product, int quantity)
        {
            var cakeInventory = await _context.InventarioPostres.FirstOrDefaultAsync(i => i.IdPostre == product.Id);
            if (cakeInventory == null || cakeInventory.Cantidad < quantity)
            {
                return $"No hay suficiente inventario para el producto {product.Nombre}";
            }
            return "ok";
        }

        public class CheckInventoryDTO
        {
            public int IdProduct { get; set; }
            public int Quantity { get; set; }
        }


        [HttpPost]
        [Route("checkInventory")]
        public async Task<IActionResult> CheckInventory(CheckInventoryDTO data)
        {
            // Obtener el producto de la base de datos
            var product = await _context.Productos
                .Include(p => p.Ingredientes) // Asegurarse de incluir los ingredientes en caso de ser necesario
                .FirstOrDefaultAsync(p => p.Id == data.IdProduct);

            if (product == null)
            {
                return NotFound($"El producto con ID {data.IdProduct} no existe.");
            }

            // Verificar si el producto es especial o no
            string result;
            if (IsSpecialProduct(data.IdProduct))
            {
                result = await CheckCakeInventory(product, data.Quantity);
            }
            else
            {
                result = await CheckIngredientsInventory(product, data.Quantity);
            }

            // Retornar la respuesta según el resultado del inventario
            if (result == "ok")
            {
                return Ok("Inventario disponible.");
            }
            else
            {
                return BadRequest(result); // Mensaje de error detallado sobre el inventario insuficiente
            }
        }


        private async Task<string> CheckIngredientsInventory(Producto product, int quantity)
        {
            foreach (var ingredient in product.Ingredientes)
            {
                var ingredientInventory = await _context.InventarioMPs.FirstOrDefaultAsync(i => i.Id == ingredient.Id);

                // Verificar si la materia prima está caducada
                if (ingredientInventory.Caducidad < DateTime.Now)
                {
                    return $"La materia prima {ingredient.MateriaPrima.Material} está caducada";
                }

                // Convertir float? a decimal para la comparación
                if (ingredientInventory == null || (ingredientInventory.Cantidad.HasValue ? (decimal)ingredientInventory.Cantidad.Value : 0m) < (decimal)(ingredient.Cantidad * quantity))
                {
                    return $"No hay suficiente inventario para el producto {product.Nombre}";
                }
            }
            return "ok";
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
                //Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpGet]
        // [Authorize]
        [Route("orderDetail/{id}")]
        public async Task<IActionResult> GetOrderDetail(int? id)
        {
            if (id == null)
            {
                return BadRequest("El ID de la orden no puede ser nulo");
            }

            try
            {
                var details = await _context.DetailOrders
                                            .Where(d => d.IdOrder == id)
                                            .Select(d => new
                                            {
                                                d.Id,
                                                d.IdOrder,
                                                d.IdProduct,
                                                d.Quantity,
                                                d.PriceSingle,
                                                d.Status,
                                                DateOrder = DateTime.Parse(d.DateOrder.ToString() ?? ""),
                                                Product = _context.Productos
                                                                  .Where(p => p.Id == d.IdProduct)
                                                                  .Select(p => new
                                                                  {
                                                                      p.Id,
                                                                      p.Nombre, // Asegúrate de que esta propiedad coincida con tu modelado de back-end
                                                                      p.Precio,
                                                                      // otros campos necesarios
                                                                  }).FirstOrDefault()
                                            }).ToListAsync();

                if (details == null || !details.Any())
                {
                    return NotFound("No se encontraron detalles de la orden");
                }

                return Ok(details);
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPost]
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
                    IsDeliver = ordertdo.IsDeliver,
                    PromCode = ordertdo.PromCode,
                    PromDesc = ordertdo.PromDesc,
                    TotalHeavenCoins = ordertdo.TotalHeavenCoins
                };

                if (ordertdo.CreditCard != null)
                {
                    var result = _creditCardService.canPay(ordertdo.CreditCard, (decimal)orden.Total);
                    if (result != "La tarjeta es válida")
                    {
                        return BadRequest(result);
                    }
                }
                else
                {
                    var creditCard = new CreditCard
                    {
                        CardHolderName = "Nombre de prueba",
                        CardNumber = "4500000000000000", // Número de prueba válido
                        CVV = "123",
                        ExpiryDate = "12/25",
                        UserId = ordertdo.IdUser
                    };

                    ordertdo.CreditCard = creditCard;
                }

                if (ordertdo.Direcciones == null && ordertdo.IsDeliver == false)
                {
                    var direccion = new Direcciones
                    {
                        Calle = "Calle de prueba",
                        NumeroExterior = 123,
                        Estatus = "Activo",
                        Colonia = "Colonia de prueba",
                        Ciudad = "Ciudad de prueba",
                        Estado = "Estado de prueba",
                        Pais = "Pais de prueba",
                        CodigoPostal = "12345",
                        UserId = ordertdo.IdUser,
                    };

                    await _context.Direcciones.AddAsync(direccion);
                }
                else
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

                await _context.Orders.AddAsync(orden);
                await _context.SaveChangesAsync();
              
                // Guardado de los detalles de la orden
                foreach (var d in ordertdo.DetailOrders)
                {
                    // Verificar si hay suficiente inventario para el producto
                    var inventoryStatus = await ProductInInventory(d.IdProduct, d.Quantity);
                    if (inventoryStatus != "ok")
                    {
                        return BadRequest(inventoryStatus);
                    }

                    // Verificar si cada d tiene los campos necesarios para crear un DetailOrder y si no, saltar a la siguiente iteración
                    if (d.IdProduct == 0 || d.Quantity == 0 || d.PriceSingle == 0)
                    {
                        continue;
                    }

                    var detail = new DetailOrder
                    {
                        IdOrder = orden.Id,
                        IdProduct = d.IdProduct,
                        Quantity = d.Quantity,
                        PriceSingle = d.PriceSingle,
                        DateOrder = DateTime.Now,
                        Ingredients = d.Ingredients,
                        Status = "Ordenado",
                        HeavenCoins = d.HeavenCoins,
                        discount = d.Discount
                    };

                    orden.DetailOrders?.Add(detail);
                    await _context.DetailOrders.AddAsync(detail);
                }

                await _context.SaveChangesAsync();

                // Petición para generar el QR después de guardar la orden y sus detalles
                //using (HttpClient client = new HttpClient())
                //{
                //   var data = new Dictionary<string, string?>
                //{
                //   { "id", orden.Id.ToString() },
                //   { "ticket", orden.Ticket.ToString() },
                //};

                //   var content = new FormUrlEncodedContent(data);

                //   Console.WriteLine($"Se genero el QR, {data["id"]}, {data["ticket"]}");

                //   HttpResponseMessage response = await client.PostAsync("http://localhost:5000/generate_qr_order", content);

                //   if (response.IsSuccessStatusCode)
                //   {
                //       responseStatus = response.StatusCode.ToString();
                //       Console.WriteLine(response.Content);
                //   }
                //   else
                //   {
                //       responseStatus = response.StatusCode.ToString();
                //       Console.WriteLine(response.Content);
                //       return NotFound($"Error con el QR, status: {responseStatus}");
                //   }
                //}

                return Ok(orden);
            }
            catch (Exception ex)
            {
                return NotFound("Se produjo un error en el servidor, contacte a soporte");
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
                //Console.WriteLine(ex.Message);

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
                    detail.Status = "Recibido";
                }

                orden.Status = "Recibido";

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);

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
                //Console.WriteLine(ex.Message);

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
                    Status = "Ordenado"
                };

                await _context.DetailOrders.AddAsync(product);

                //Console.WriteLine($"Se guaradaron los cambios, {product.Id}, {product.IdProduct}, {product.Order}");

                return Ok();
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);

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
                //Console.WriteLine(ex.Message);
                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }

        [HttpPut]
        // [Authorize]
        [Route("updateOrder/{id},{status}")]
        public async Task<IActionResult> UpdateOrder(int id, string status)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);

                if (order == null)
                {
                    return NotFound("No se encontro la orden");
                }

                if (status == "Recibido")
                {
                    var detailOrder = await _context.DetailOrders.Where(d => d.IdOrder == order.Id).ToListAsync();

                    foreach (var detail in detailOrder)
                    {
                        detail.Status = "Recibido";
                    }

                    await _context.SaveChangesAsync();
                }

                if (status == "Cancelado")
                {
                    var detailOrder = await _context.DetailOrders.Where(d => d.IdOrder == order.Id).ToListAsync();

                    foreach (var detail in detailOrder)
                    {
                        detail.Status = "Cancelado";
                    }

                    await _context.SaveChangesAsync();
                }

                order.Status = status;

                await _context.SaveChangesAsync();

                return Ok(order);
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPut]
        // [Authorize]
        [Route("updateDetailOrderStatus/{id},{status}")]
        public async Task<IActionResult> UpdateDetailOrderStatus(int id, string status)
        {
            try
            {
                var detailOrder = await _context.DetailOrders.FindAsync(id);

                if (detailOrder == null)
                {
                    return NotFound("No se encontro el detalle de la orden");
                }

                detailOrder.Status = status;

                await _context.SaveChangesAsync();

                return Ok(detailOrder);
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }

        private bool OrderExists(int? id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }


		[HttpPost]
		[Route("getBestSellers/{date}")]
		public async Task<IActionResult> GetBestSellers(string date)
		{
			try
			{
				// Determinar el rango de fechas según la entrada
				var (startDate, endDate) = GetDateRange(date);
				if (startDate == null || endDate == null)
				{
					return BadRequest("Rango de fechas inválido.");
				}

				// Contar órdenes no entregadas
				var allOrdersNoDeliver = await _context.Orders
					.Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.IsDeliver == false)
					.CountAsync();

				// Contar órdenes entregadas
				var allOrdersDeliver = await _context.Orders
					.Where(o => o.OrderDate >= startDate && o.OrderDate <= endDate && o.IsDeliver == true)
					.CountAsync();

				// Formatear el resultado
				var result = new
				{
					OrdersDeliver = allOrdersDeliver,
					OrdersNoDeliver = allOrdersNoDeliver
				};
				Console.WriteLine(JsonConvert.SerializeObject(result.GetType()));

				return Ok(result);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return StatusCode(500);
			}
		}

		// Método para calcular el rango de fechas
		private (DateTime?, DateTime?) GetDateRange(string date)
		{
			DateTime today = DateTime.UtcNow.Date;

			return date.ToLower() switch
			{
				"today" => (today, today),
				"yesterday" => (today.AddDays(-1), today.AddDays(-1)),
				"lastweek" => (today.AddDays(-7), today),
				"lastmonth" => (today.AddMonths(-1), today),
				"lastyear" => (today.AddYears(-1), today),
				_ => (null, null) // Valor por defecto si no coincide con los casos
			};
		}

	}
}
