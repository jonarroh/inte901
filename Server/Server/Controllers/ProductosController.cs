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
    public class ProductosController : ControllerBase
    {
        private readonly Context _context;

        public ProductosController(Context context)
        {
            _context = context;
        }

        // GET: api/Productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDTO>>> GetProductos()
        {
            var productos = await _context.Productos
                .Select(p => new ProductoDTO
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Precio = p.Precio,
                    Descripcion = p.Descripcion,
                    Estatus = p.Estatus,
                    Tipo = p.Tipo,
                    CantidadXReceta = p.CantidadXReceta,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(productos);
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDTO>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .Where(p => p.Id == id)
                .Select(p => new ProductoDTO
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    Precio = p.Precio,
                    Descripcion = p.Descripcion,
                    Estatus = p.Estatus,
                    Tipo = p.Tipo,
                    CantidadXReceta = p.CantidadXReceta,
                    CreatedAt = p.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (producto == null)
            {
                return NotFound();
            }

            return Ok(producto);
        }

        // PUT: api/Productos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, ProductoDTO productoDto)
        {
            if (id != productoDto.Id)
            {
                return BadRequest();
            }

            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            producto.Nombre = productoDto.Nombre;
            producto.Precio = productoDto.Precio;
            producto.Descripcion = productoDto.Descripcion;
            producto.Estatus = productoDto.Estatus;
            producto.Tipo = productoDto.Tipo;
            producto.CantidadXReceta = productoDto.CantidadXReceta;
            producto.CreatedAt = productoDto.CreatedAt;

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExists(id))
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

        // POST: api/Productos
        [HttpPost]
        public async Task<ActionResult<ProductoDTO>> PostProducto(ProductoDTO productoDto)
        {
            var producto = new Producto
            {
                Nombre = productoDto.Nombre,
                Precio = productoDto.Precio,
                Descripcion = productoDto.Descripcion,
                Estatus = productoDto.Estatus,
                Tipo = productoDto.Tipo,
                CantidadXReceta = productoDto.CantidadXReceta,
                CreatedAt = productoDto.CreatedAt
            };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            productoDto.Id = producto.Id;

            return CreatedAtAction("GetProducto", new { id = productoDto.Id }, productoDto);
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoExists(int id)
        {
            return _context.Productos.Any(e => e.Id == id);
        }
    }
}
