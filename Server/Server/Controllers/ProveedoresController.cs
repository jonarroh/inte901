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
    public class ProveedoresController : ControllerBase
    {
        private readonly Context _context;

        public ProveedoresController(Context context)
        {
            _context = context;
        }

        // GET: api/Proveedores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProveedorDTO>>> GetProveedores()
        {
            var proveedores = await _context.Proveedores
                .Select(p => new ProveedorDTO
                {
                    Id = p.Id,
                    NombreEmpresa = p.NombreEmpresa,
                    DireccionEmpresa = p.DireccionEmpresa,
                    TelefonoEmpresa = p.TelefonoEmpresa,
                    NombreEncargado = p.NombreEncargado,
                    Estatus = p.Estatus,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    DeletedAt = p.DeletedAt,
                    IdUsuario = p.IdUsuario
                })
                .ToListAsync();

            return Ok(proveedores);
        }

        // GET: api/Proveedores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProveedorDTO>> GetProveedor(int id)
        {
            var proveedor = await _context.Proveedores
                .Where(p => p.Id == id)
                .Select(p => new ProveedorDTO
                {
                    Id = p.Id,
                    NombreEmpresa = p.NombreEmpresa,
                    DireccionEmpresa = p.DireccionEmpresa,
                    TelefonoEmpresa = p.TelefonoEmpresa,
                    NombreEncargado = p.NombreEncargado,
                    Estatus = p.Estatus,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    DeletedAt = p.DeletedAt,
                    IdUsuario = p.IdUsuario
                })
                .FirstOrDefaultAsync();

            if (proveedor == null)
            {
                return NotFound();
            }

            return Ok(proveedor);
        }

        // PUT: api/Proveedores/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProveedor(int id, ProveedorDTO proveedorDto)
        {
            if (id != proveedorDto.Id)
            {
                return BadRequest();
            }

            var proveedor = await _context.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            proveedor.NombreEmpresa = proveedorDto.NombreEmpresa;
            proveedor.DireccionEmpresa = proveedorDto.DireccionEmpresa;
            proveedor.TelefonoEmpresa = proveedorDto.TelefonoEmpresa;
            proveedor.NombreEncargado = proveedorDto.NombreEncargado;
            proveedor.Estatus = proveedorDto.Estatus;
            proveedor.CreatedAt = proveedorDto.CreatedAt;
            proveedor.UpdatedAt = DateTime.Now;
            proveedor.DeletedAt = proveedorDto.DeletedAt;
            proveedor.IdUsuario = proveedorDto.IdUsuario;

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

        // POST: api/Proveedores
        [HttpPost]
        public async Task<ActionResult<ProveedorDTO>> PostProveedor(ProveedorDTO proveedorDto)
        {
            var proveedor = new Proveedor
            {
                NombreEmpresa = proveedorDto.NombreEmpresa,
                DireccionEmpresa = proveedorDto.DireccionEmpresa,
                TelefonoEmpresa = proveedorDto.TelefonoEmpresa,
                NombreEncargado = proveedorDto.NombreEncargado,
                Estatus = proveedorDto.Estatus,
                CreatedAt = DateTime.Now,
                UpdatedAt = proveedorDto.UpdatedAt,
                DeletedAt = proveedorDto.DeletedAt,
                IdUsuario = proveedorDto.IdUsuario
            };

            _context.Proveedores.Add(proveedor);
            await _context.SaveChangesAsync();

            proveedorDto.Id = proveedor.Id;

            return CreatedAtAction("GetProveedor", new { id = proveedorDto.Id }, proveedorDto);
        }

        // DELETE: api/Proveedores/5
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

        private bool ProveedorExists(int id)
        {
            return _context.Proveedores.Any(e => e.Id == id);
        }
    }
}
