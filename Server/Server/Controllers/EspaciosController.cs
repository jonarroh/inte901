using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using System.Collections.Generic;
using System.Linq;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EspaciosController : ControllerBase
    {
        // In-memory list to simulate a database
        private static List<Espacio> _espacios = new List<Espacio>();

        // GET: api/Espacios
        [HttpGet]
        public ActionResult<IEnumerable<Espacio>> GetEspacios()
        {
            return Ok(_espacios);
        }

        // GET: api/Espacios/5
        [HttpGet("{id}")]
        public ActionResult<Espacio> GetEspacio(int id)
        {
            var espacio = _espacios.FirstOrDefault(e => e.idEspacio == id);
            if (espacio == null)
            {
                return NotFound();
            }
            return Ok(espacio);
        }

        // POST: api/Espacios
        [HttpPost]
        public ActionResult<Espacio> PostEspacio(Espacio espacio)
        {
            if (_espacios.Any(e => e.idEspacio == espacio.idEspacio))
            {
                return BadRequest("Espacio with the same id already exists.");
            }

            _espacios.Add(espacio);
            return CreatedAtAction(nameof(GetEspacio), new { id = espacio.idEspacio }, espacio);
        }

        // PUT: api/Espacios/5
        [HttpPut("{id}")]
        public IActionResult PutEspacio(int id, Espacio updatedEspacio)
        {
            var espacio = _espacios.FirstOrDefault(e => e.idEspacio == id);
            if (espacio == null)
            {
                return NotFound();
            }

            espacio.nombre = updatedEspacio.nombre;
            espacio.canPersonas = updatedEspacio.canPersonas;
            espacio.precio = updatedEspacio.precio;
            espacio.estatus = updatedEspacio.estatus;
            espacio.descripcion = updatedEspacio.descripcion;

            return NoContent();
        }

        // DELETE: api/Espacios/5
        [HttpDelete("{id}")]
        public IActionResult DeleteEspacio(int id)
        {
            var espacio = _espacios.FirstOrDefault(e => e.idEspacio == id);
            if (espacio == null)
            {
                return NotFound();
            }

            _espacios.Remove(espacio);
            return NoContent();
        }
    }
}
