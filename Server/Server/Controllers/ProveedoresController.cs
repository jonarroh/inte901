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
    [Authorize]
    [ApiController]
    public class ProveedoresController : ControllerBase
    {
        private readonly Context _context;

        public ProveedoresController(Context context)
        {
            _context = context;
        }

        // GET: api/Proveedor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Proveedor>>> GetProveedores()
        {
            return await _context.Proveedores.ToListAsync();
        }

        // GET: api/Proveedor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Proveedor>> GetProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            return proveedor;
        }

        // PUT: api/Proveedor/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProveedor(int id, ProveedorDTO proveedorDTO)
        {
            if (id != proveedorDTO.Id)
            {
                return BadRequest();
            }

            var proveedor = await _context.Proveedores.FindAsync(id);
            if (proveedor == null)
            {
                return NotFound();
            }

            proveedor.NombreEmpresa = proveedorDTO.NombreEmpresa;
            proveedor.DireccionEmpresa = proveedorDTO.DireccionEmpresa;
            proveedor.TelefonoEmpresa = proveedorDTO.TelefonoEmpresa;
            proveedor.NombreEncargado = proveedorDTO.NombreEncargado;
            proveedor.Estatus = proveedorDTO.Estatus;
            proveedor.UpdatedAt = proveedorDTO.UpdatedAt ?? DateTime.Now;
            proveedor.DeletedAt = proveedorDTO.DeletedAt;
            proveedor.IdUsuario = proveedorDTO.IdUsuario;

            _context.Entry(proveedor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProveedorExists(id))
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

        // POST: api/Proveedor
        [HttpPost]
        public async Task<ActionResult<Proveedor>> PostProveedor(ProveedorDTO proveedorDTO)
        {
            var proveedor = new Proveedor
            {
                NombreEmpresa = proveedorDTO.NombreEmpresa,
                DireccionEmpresa = proveedorDTO.DireccionEmpresa,
                TelefonoEmpresa = proveedorDTO.TelefonoEmpresa,
                NombreEncargado = proveedorDTO.NombreEncargado,
                Estatus = proveedorDTO.Estatus,
                CreatedAt = proveedorDTO.CreatedAt ?? DateTime.Now,
                UpdatedAt = proveedorDTO.UpdatedAt,
                DeletedAt = proveedorDTO.DeletedAt,
                IdUsuario = proveedorDTO.IdUsuario
            };

            _context.Proveedores.Add(proveedor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProveedor", new { id = proveedor.Id }, proveedor);
        }

        // DELETE: api/Proveedor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProveedor(int id)
        {
            var proveedor = await _context.Proveedores.FindAsync(id);
            if (proveedor == null)
            {
                return NotFound();
            }

            _context.Proveedores.Remove(proveedor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //POST: api/Proveedor/Bulk
        [HttpPost]
        [Route("Bulk")]
        public async Task<ActionResult<IEnumerable<Proveedor>>> PostProveedores(List<ProveedorDTO> proveedoresDTO)
        {
            var proveedores = proveedoresDTO.Select(proveedorDTO => new Proveedor
            {
                NombreEmpresa = proveedorDTO.NombreEmpresa,
                DireccionEmpresa = proveedorDTO.DireccionEmpresa,
                TelefonoEmpresa = proveedorDTO.TelefonoEmpresa,
                NombreEncargado = proveedorDTO.NombreEncargado,
                Estatus = proveedorDTO.Estatus,
                CreatedAt = proveedorDTO.CreatedAt ?? DateTime.Now,
                UpdatedAt = proveedorDTO.UpdatedAt,
                DeletedAt = proveedorDTO.DeletedAt,
                IdUsuario = proveedorDTO.IdUsuario
            });

            _context.Proveedores.AddRange(proveedores);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProveedores", proveedores);
        }

        private bool ProveedorExists(int id)
        {
            return _context.Proveedores.Any(e => e.Id == id);
        }
    }
}
