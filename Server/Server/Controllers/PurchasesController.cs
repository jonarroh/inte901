using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Server;
using Server.Models;
using Server.Models.DTO;
using Server.Models.Usuario.Server.Models.Usuario;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchasesController : ControllerBase
    {
        private readonly Context _context;

        public PurchasesController(Context context)
        {
            _context = context;
        }


        [HttpGet]
        //[Authorize]
        [Route("allCompras")]
        public async Task<IActionResult> GetCompras()
        {
            try
            {
                var compras = await _context.Purchases.ToListAsync();
                var result = new List<allCompras>();
                var detail = new List<DetalleCompra>();

                if (compras == null || compras.Count == 0)
                {
                    return BadRequest("No hay compras encontradas");
                }

                foreach (var compra in compras)
                {
                    compra.CreatedAt = DateTime.Parse(compra.CreatedAt.ToString() ?? "");
                    compra.DetailPurchases = await _context.DetailPurchases.Where(d => d.IdPurchase == compra.Id).ToListAsync();
                    compra.User = await _context.Users.FindAsync(compra.IdUser);
                }

                return Ok(compras);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


         [HttpGet]
        //[Authorize]
        [Route("getCompra/{id}")]
        public async Task<IActionResult> GetCompra(int? id)
        {
            try
            {
                var compra = await _context.Purchases.FindAsync(id);

                if (compra == null)
                {
                    return BadRequest("No se encontro la compra");
                }

                return Ok(compra);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


         [HttpGet]
        // [Authorize]
        [Route("filterCompraByStatus/{status}")]
        public async Task<IActionResult> FilterCompraByStatus(string? status)
        {
            try
            {
                var compra = await _context.Purchases.Where(c => c.Status == status).ToListAsync();

                if (compra == null)
                {
                    return BadRequest($"No se encontraron compras con el estatus - {status} -");
                }

                return Ok(compra);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPost]
        // [Authorize]
        [Route("addCompra")]
        public async Task<IActionResult> AddCompra(PurchaseDTO compradto)
        {
            try
            {
                if (compradto == null)
                {
                    return BadRequest("Campos incompletos, es necesario completar todos los datos.");
                }

                var compra = new Purchase
                {
                    IdUser = compradto.IdUser,
                    CreatedAt = DateTime.Now,
                    Status = "Pendiente"
                };
                Console.WriteLine(JsonConvert.SerializeObject(compra));

                await _context.Purchases.AddAsync(compra);
                await _context.SaveChangesAsync();

                foreach (var item in compradto.Details)
                {
                    var detail = new DetailPurchase
                    {
                        IdPurchase = compra.Id,
                        IdProduct = item.IdProduct,
                        Quantity = item.Quantity,
                        PriceSingle = item.PriceSingle,
                        Presentation = item.Presentation,
                        Expiration = DateTime.Now,
                        UnitType = item.UnitType,
                        CreatedAt = DateTime.Now,
                        Status = "Pendiente"
                    };

                    await _context.DetailPurchases.AddAsync(detail);
                    await _context.SaveChangesAsync();
                    Console.WriteLine(JsonConvert.SerializeObject(detail));
                }


                return Ok(200);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPut]
        // [Authorize]
        [Route("statusCompra")]
        public async Task<IActionResult> CancelCompra(PurchaseDTO compradto)
        {
            try
            {
                var compra = await _context.Purchases.FindAsync(compradto.Id);
                var detail = await _context.DetailPurchases.Where(d => d.IdPurchase == compra.Id).ToListAsync();

                if (compra == null)
                {
                    return BadRequest("No se encontro la compra realizada");
                }

                if (compradto.Status == "Cancelada")
                {
                    compra.Status = "Cancelada";

                    foreach (var item in detail)
                    {
                        item.Status = "Cancelada";
                    }
                }

                if (compradto.Status == "Entregada")
                {
                    compra.Status = "Entregada";

                    foreach (var item in detail)
                    {
                        item.Status = "Entregada";
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(200);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }

        [HttpGet]
        // [Authorize]
        [Route("getDetailCompra/{idCompra}")]
        public async Task<IActionResult> GetDetailCompra(int? idCompra)
        {
            try
            {
                var detail = await _context.DetailPurchases.Where(d => d.IdPurchase == idCompra).ToListAsync();

                if (detail == null)
                {
                    return BadRequest("No se encontro la compra seleccionada");
                }

                foreach (var item in detail)
                {
                    item.Expiration = DateTime.Parse(item.Expiration.ToString()?.Replace("T", " ") ?? "");
                }

                return Ok(detail);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }


        [HttpPut]
        // [Authorize]
        [Route("cancelCompraProducto/{idDetail}")]
        public async Task<IActionResult> CancelCompraProducto(int? idDetail)
        {
            try
            {
                var detail = await _context.DetailPurchases.FindAsync(idDetail);

                if (detail == null)
                {
                    return BadRequest("No se encontro el insumo seleccionado");
                }

                detail.Status = "Cancelado";

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }

        private bool PurchaseExists(int? id)
        {
            return _context.Purchases.Any(e => e.Id == id);
        }

        public class allCompras()
        {
            public int Id { get; set; }
            public string Status { get; set; }
            public DateTime CreatedAt { get; set; }
            public string user { get; set; }
            public string proveedor { get; set; }
            public List<DetalleCompra> DetailPurchases { get; set; }
        }

        public class DetalleCompra()
        {
            public int IdProduct { get; set; }
            public int Quantity { get; set; }
            public double PriceSingle { get; set; }
            public string Presentation { get; set; }
            public DateTime Expiration { get; set; }
            public string UnitType { get; set; }
            public string Status { get; set; }
        }
    }
}
