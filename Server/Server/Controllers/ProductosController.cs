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
using System.Net.Http;
using System.Net.Http.Headers;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly Context _context;
        private readonly IHttpClientFactory _clientFactory;

        public ProductosController(Context context, IHttpClientFactory clientFactory)
        {
            _context = context;
            _clientFactory = clientFactory;
        }

        // GET: api/Producto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            var productos = await _context.Productos
        .Where(p => p.Estatus != 0)
        .ToListAsync();

            foreach (var producto in productos)
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

            return productos;
        }

        // GET: api/Producto/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos.Where(p => p.Id == id && p.Estatus != 0)
    .FirstOrDefaultAsync();

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

        // GET: api/Productos/TopSelling
        [HttpGet("TopSelling")]
        public async Task<ActionResult<IEnumerable<Producto>>> GetTopSellingProducts()
        {
            // Agrupamos por IdProduct y contamos cuántas veces aparece
            var topSellingProductIds = await _context.DetailOrders
                .GroupBy(d => d.IdProduct)
                .Select(group => new
                {
                    IdProduct = group.Key,
                    TotalSold = group.Count()
                })
                .OrderByDescending(g => g.TotalSold) // Ordenamos de mayor a menor
                .Take(4) // Tomamos los 4 primeros
                .ToListAsync();

            // Obtenemos los productos correspondientes
            var topProducts = await _context.Productos
                .Where(p => topSellingProductIds.Select(t => t.IdProduct).Contains(p.Id))
                .ToListAsync();

            // Opcional: si necesitas los detalles adicionales como Ingredientes
            foreach (var producto in topProducts)
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

            return Ok(topProducts);
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
            //producto.CantidadXReceta = productoDTO.CantidadXReceta;
            producto.CreatedAt = productoDTO.CreatedAt ?? producto.CreatedAt;

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

            // Enviar la imagen al API de Python si se ha proporcionado una nueva imagen
            if (productoDTO.Imagen != null)
            {
                var result = await UploadImageToPythonApi(productoDTO.Imagen, id);
                if (!result.IsSuccessStatusCode)
                {
                    // Manejo de errores: si el envío de la imagen falla, puedes decidir cómo proceder
                    return StatusCode((int)result.StatusCode, "Error al subir la imagen");
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
                //CantidadXReceta = productoDTO.CantidadXReceta,
                Temperatura = productoDTO.Temperatura,
                CreatedAt = productoDTO.CreatedAt ?? DateTime.Now
            };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            // Obtener el Id generado
            var id = producto.Id;

            // Enviar la imagen al API de Python
            if (productoDTO.Imagen != null)
            {
                var result = await UploadImageToPythonApi(productoDTO.Imagen, id.Value);
                if (!result.IsSuccessStatusCode)
                {
                    // Manejo de errores: si el envío de la imagen falla, puedes decidir cómo proceder
                    return StatusCode((int)result.StatusCode, "Error al subir la imagen");
                }
            }

            return CreatedAtAction("GetProducto", new { id = producto.Id }, producto);
        }

        private async Task<HttpResponseMessage> UploadImageToPythonApi(IFormFile imagen, int id)
        {
            var client = _clientFactory.CreateClient();

            using var content = new MultipartFormDataContent();
            content.Add(new StringContent(id.ToString()), "id");

            using var fileStream = imagen.OpenReadStream();
            var fileContent = new StreamContent(fileStream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(imagen.ContentType);
            content.Add(fileContent, "file", imagen.FileName);

            var response = await client.PostAsync("http://localhost:5000/productos/upload", content);
            return response;
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
                    //CantidadXReceta = productoDTO.CantidadXReceta,
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