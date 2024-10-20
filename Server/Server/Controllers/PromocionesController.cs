﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Server;
using Server.Models;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromocionesController : ControllerBase
    {
        private readonly Context _context;
        public PromocionesController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("allPromociones")]
        public async Task<IActionResult> GetAllPromociones()
        {
            try
            {
                var promos = await _context.Promociones.ToListAsync();

                if (promos == null || promos.Count == 0)
                {
                    return BadRequest("No hay promos registradas");
                }

                return Ok(promos);
            } catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound("vale kk");
            }
        }

        [HttpPost]
        [Route("addPromocion")]
        public async Task<IActionResult> AddPromocion(PromocionesDTO data)
        {
            try
            {
                if (data == null)
                {
                    return BadRequest("No se recibieron datos");
                }

                var promocion = new Promociones
                {
                    Nombre = data.Nombre,
                    Descripcion = data.Descripcion,
                    FechaInicio = data.FechaInicio,
                    FechaFin = data.FechaFin,
                    Productos = data.Productos,
                    Descuento = data.Descuento,
                    Estado = data.Estado,
                    BadgePromoId = data.BadgePromoId,
                    LimiteCanje = data.LimiteCanje,
                    CreatedAt = DateTime.Now.ToString(),
                    UpdatedAt = DateTime.Now.ToString(),
                    DeletedAt = ""
                };

                await _context.Promociones.AddAsync(promocion);

                await _context.SaveChangesAsync();

                return Ok("Se registró correctamente la promoción");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }

        [HttpPut]
        [Route("updatePromocion/{id}")]
        public async Task<IActionResult> UpdatePromocion(int id, [FromBody] PromocionesDTO data)
        {
            try
            {
                var promocion = await _context.Promociones.FindAsync(id);

                if (promocion == null)
                {
                    return BadRequest("No se encontro la promocion");
                }

                promocion.Nombre = data.Nombre;
                promocion.Descripcion = data.Descripcion;
                promocion.FechaInicio = data.FechaInicio;
                promocion.FechaFin = data.FechaFin;
                promocion.Productos = data.Productos;
                promocion.Descuento = data.Descuento;
                promocion.Estado = data.Estado;
                promocion.BadgePromoId = data.BadgePromoId;
                promocion.LimiteCanje = data.LimiteCanje;
                promocion.UpdatedAt = DateTime.Now.ToString();

                _context.Promociones.Update(promocion);

                return Ok("Se actualizo correctamente la promoción");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }

        [HttpPut]
        [Route("deletePromocion/{id}")]
        public async Task<IActionResult> DeletePromocion(int id)
        {
            try
            {
                var promocion = await _context.Promociones.FindAsync(id);

                if (promocion == null)
                {
                    return BadRequest("No se encontro la promocion");
                }

                promocion.DeletedAt = DateTime.Now.ToString();
                promocion.Estado = 0;

                _context.Promociones.Update(promocion);

                return Ok("Se eliminó correctamente la promoción");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }

        [HttpGet]
        [Route("getPromocion/{id}")]
        public async Task<IActionResult> GetPromocion(int id)
        {
            try
            {
                var promocion = await _context.Promociones.FindAsync(id);

                if (promocion == null)
                {
                    return BadRequest("No se encontro la promocion");
                }

                return Ok(promocion);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound("Se produjo un error en el servidor, contacte a soporte");
            }
        }
    }
}