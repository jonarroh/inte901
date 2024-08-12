using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server;
using Server.lib;
using Server.Models;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly Context _context;
        private readonly IHttpCDNService _cdnService;

        public ProductosController(Context context)
        {
            _context = context;
        }

        // GET: api/Producto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            var productos = await _context.Productos.ToListAsync();

            foreach(var producto in productos)
            {
                var ingredientes = await _context.Ingredientes
                    .Where(i => i.IdProducto == producto.Id)
                    .ToListAsync();

                foreach (var ingrediente in ingredientes)
                {
                    ingrediente.MateriaPrima = await _context.MateriasPrimas.FindAsync(ingrediente.IdMateriaPrima);
                }

                producto.Ingredientes = ingredientes;
            }

            return await _context.Productos.ToListAsync();
        }

        // GET: api/Producto/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            //al producto agregarle los ingredientes
            var ingredientes = await _context.Ingredientes
                .Where(i => i.IdProducto == producto.Id)
                .ToListAsync();

            //a los ingredientes agregarle las materias primas
            foreach (var ingrediente in ingredientes)
            {
                ingrediente.MateriaPrima = await _context.MateriasPrimas.FindAsync(ingrediente.IdMateriaPrima);
            }

            producto.Ingredientes = ingredientes;



            return producto;
        }



        // PUT: api/Producto/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, ProductoDTO productoDTO)
        {
            if (id != productoDTO.Id)
            {
                return BadRequest();
            }

            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            producto.Nombre = productoDTO.Nombre;
            producto.Precio = productoDTO.Precio;
            producto.Descripcion = productoDTO.Descripcion;
            producto.Estatus = productoDTO.Estatus;
            producto.Tipo = productoDTO.Tipo;
            producto.Temperatura = productoDTO.Temperatura;
            producto.CantidadXReceta = productoDTO.CantidadXReceta;
            producto.CreatedAt = productoDTO.CreatedAt;

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

        // POST: api/Producto
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(ProductoDTO productoDTO)
        {
            var producto = new Producto
            {
                Nombre = productoDTO.Nombre,
                Precio = productoDTO.Precio,
                Descripcion = productoDTO.Descripcion,
                Estatus = productoDTO.Estatus,
                Tipo = productoDTO.Tipo,
                CantidadXReceta = productoDTO.CantidadXReceta,
                Temperatura = productoDTO.Temperatura,
                CreatedAt = productoDTO.CreatedAt ?? DateTime.Now
            };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProducto", new { id = producto.Id }, producto);
        }

        // DELETE: api/Producto/5
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

        //POst: api/Producto/Bulk

        [HttpPost]
        [Route("Bulk")]
        public async Task<ActionResult<IEnumerable<Producto>>>
            PostProductos(List<ProductoDTO> productosDTO)
        {
            List<Producto> productos = new List<Producto>();

            foreach (var productoDTO in productosDTO)
            {
                var producto = new Producto
                {
                    Nombre = productoDTO.Nombre,
                    Precio = productoDTO.Precio,
                    Descripcion = productoDTO.Descripcion,
                    Estatus = productoDTO.Estatus,
                    Tipo = productoDTO.Tipo,
                    CantidadXReceta = productoDTO.CantidadXReceta,
                    Temperatura = productoDTO.Temperatura,
                    CreatedAt = productoDTO.CreatedAt ?? DateTime.Now
                };

                productos.Add(producto);
            }

            _context.Productos.AddRange(productos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductos", productos);
        }

        private bool ProductoExists(int id)
        {
            return _context.Productos.Any(e => e.Id == id);
        }
    }
}
