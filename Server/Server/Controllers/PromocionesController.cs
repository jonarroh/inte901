using Microsoft.AspNetCore.Mvc;
//using Server.Models.DTO.PromocionesDTO;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromocionesController : Controller
    {
        private readonly Context _context;
        public PromocionesController(Context context)
        {
            _context = context;
        }

        //[HttpGet]
        //[Route("allPromociones")]
        //public IActionResult GetPromociones()
        //{
        //    try
        //    {
        //        var promociones = _context.Promociones.ToList();
        //        if (promociones == null || promociones.Count == 0)
        //        {
        //            return BadRequest("No hay promociones encontradas");
        //        }
        //        return Ok(promociones);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //        return NotFound("Se produjo un error en el servidor, contacte a soporte");
        //    }
        //}

        //[HttpPost]
        //[Route("addPromocion")]
        //public async Task<IActionResult> AddPromocion(PromocionesDTO data)
        //{
        //    try
        //    {
        //        if (data == null)
        //        {
        //            return BadRequest("No se recibieron datos");
        //        }

        //        var promocion = new Promociones
        //        {
        //            Nombre = data.Nombre,
        //            Descripcion = data.Descripcion,
        //            FechaInicio = data.FechaInicio,
        //            FechaFin = data.FechaFin,
        //            Productos = data.Productos,
        //            Descuento = data.Descuento,
        //            Estado = data.Estado,
        //            BadgePromoId = data.BadgePromoId,
        //            LimiteCanje = data.LimiteCanje,
        //            CreatedAt = DateTime.Now.ToString()
        //        };

        //        await _context.Promociones.AddAsync(promocion);

        //        await _context.SaveChangesAsync();

        //        return Ok("Promocion agregada correctamente");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //        return NotFound("Se produjo un error en el servidor, contacte a soporte");
        //    }
        //}

        //[HttpPut]
        //[Route("updatePromocion/{id}")]
        //public async Task<IActionResult> UpdatePromocion(int id)
        //{
        //    try
        //    {
        //        var data = await _context.Promociones.FindAsync(id);
        //        if (data == null)
        //        {
        //            return BadRequest("No se recibieron datos");
        //        }

        //        var promocion = await _context.Promociones.FindAsync(data.Id);

        //        if (promocion == null)
        //        {
        //            return BadRequest("No se encontro la promocion");
        //        }

        //        promocion.Nombre = data.Nombre;
        //        promocion.Descripcion = data.Descripcion;
        //        promocion.FechaInicio = data.FechaInicio;
        //        promocion.FechaFin = data.FechaFin;
        //        promocion.Productos = data.Productos;
        //        promocion.Descuento = data.Descuento;
        //        promocion.Estado = data.Estado;
        //        promocion.BadgePromoId = data.BadgePromoId;
        //        promocion.LimiteCanje = data.LimiteCanje;
        //        promocion.UpdatedAt = DateTime.Now.ToString();

        //        _context.Promociones.Update(promocion);

        //        return Ok("Promoción actualizada");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //        return NotFound("Se produjo un error en el servidor, contacte a soporte");
        //    }
        //}

        //[HttpPut]
        //[Route("deletePromocion/{id}")]
        //public async Task<IActionResult> DeletePromocion(int id)
        //{
        //    try
        //    {
        //        var promocion = await _context.Promociones.FindAsync(id);

        //        if (promocion == null)
        //        {
        //            return BadRequest("No se encontro la promocion");
        //        }

        //        promocion.DeletedAt = DateTime.Now.ToString();
        //        promocion.Estado = 0;

        //        _context.Promociones.Update(promocion);

        //        return Ok("Promoción eliminada");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //        return NotFound("Se produjo un error en el servidor, contacte a soporte");
        //    }
        //}
    }
}
