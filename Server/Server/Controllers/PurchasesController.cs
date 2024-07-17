using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server;
using Server.Models;

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

                if (compras == null || compras.Count == 0)
                {
                    return BadRequest("No hay compras encontradas");
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

       
        private bool PurchaseExists(int? id)
        {
            return _context.Purchases.Any(e => e.Id == id);
        }
    }
}
