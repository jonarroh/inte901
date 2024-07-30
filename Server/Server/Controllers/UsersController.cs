using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server;
using Server.Models.Usuario.Server.Models.Usuario;
using Server.lib;
using System.Security.Cryptography;
using System.Text;
using Server.Models.DTO;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly Context _context;
        private readonly IHttpCDNService _cdnService;

        public UsersController(Context context, IHttpCDNService cdnService)
        {
            _context = context;
            _cdnService = cdnService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _context.Users.Where(u => u.Estatus == "Activo").ToListAsync();

            // Agregar direcciones a cada usuario
            foreach (var user in users)
            {
                user.Direcciones = await _context.Direcciones
                                               .Where(d => d.UserId == user.Id && d.Estatus == "Activo")
                                               .ToListAsync();
            }

            var usersDTO = new List<UserDTO>();

            foreach (var u in users)
            {
                var userDTO = new UserDTO
                {
                    Id = u.Id,
                    Name = u.Name,
                    LastName = u.LastName,
                    Email = u.Email,
                    Role = u.Role,
                    Direcciones = u.Direcciones,
                    CreditCards = await _context.CreditCard
                                                .Where(c => c.UserId == u.Id)
                                                .Select(c => new CreditCardDTO
                                                {
                                                    Id = c.Id,
                                                    CardHolderName = c.CardHolderName,
                                                    CardNumber = c.CardNumber,
                                                    ExpiryDate = c.ExpiryDate,
                                                    UserId = c.UserId
                                                }).ToListAsync()
                };

                usersDTO.Add(userDTO);
            }

            return Ok(usersDTO);
        }

       

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null || user.Estatus != "Activo")
            {
                return NotFound();
            }

            var userDTO = new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                Direcciones = await _context.Direcciones
                                            .Where(d => d.UserId == user.Id && d.Estatus == "Activo")
                                            .ToListAsync(),
                CreditCards = await _context.CreditCard
                                            .Where(c => c.UserId == user.Id && c.Estatus == "Activo")
                                            .Select(c => new CreditCardDTO
                                            {
                                                Id = c.Id,
                                                CardHolderName = c.CardHolderName,
                                                CardNumber = c.CardNumber,
                                                ExpiryDate = c.ExpiryDate,
                                                UserId = c.UserId
                                            }).ToListAsync()
            };

            return userDTO;
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDTO>> PutUser(int id, [FromForm] UserEditDTO userEditDto)
        {
            if (id != userEditDto.Id)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null || user.Estatus != "Activo")
            {
                return NotFound();
            }

            // Actualiza las propiedades del usuario
            user.Name = userEditDto.Name;
            user.LastName = userEditDto.LastName;
            user.Email = userEditDto.Email;

            if (!string.IsNullOrEmpty(userEditDto.NewPassword) && !string.IsNullOrEmpty(userEditDto.ActualPassword))
            {
                // Lógica para cambiar la contraseña, por ejemplo, verificar la contraseña actual y actualizar con la nueva
                if (user.Password == userEditDto.ActualPassword) // Ejemplo, asegúrate de tener una verificación segura
                {
                    user.Password = userEditDto.NewPassword;
                }
                else
                {
                    return BadRequest("Contraseña actual incorrecta");
                }
            }

            if (userEditDto.Image != null)
            {
                var imageUrl = await _cdnService.UploadImageAsync(userEditDto.Image, id);
                // Si se sube la imagen, continuar con la lógica de negocio, si no, mandar mensaje de error
                if (imageUrl == "Error")
                {
                    return BadRequest("Error al subir la imagen");
                }
              
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            var userDTO = new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                Direcciones = await _context.Direcciones
                                            .Where(d => d.UserId == user.Id && d.Estatus == "Activo")
                                            .ToListAsync(),
                CreditCards = await _context.CreditCard
                                            .Where(c => c.UserId == user.Id && c.Estatus == "Activo")
                                            .Select(c => new CreditCardDTO
                                            {
                                                Id = c.Id,
                                                CardHolderName = c.CardHolderName,
                                                CardNumber =c.CardNumber,
                                                ExpiryDate = c.ExpiryDate,
                                                UserId = c.UserId
                                            }).ToListAsync()
            };

            return userDTO;
        }

        public static string StringToSha256(string str)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(str));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            user.Password = StringToSha256(user.Password);
            user.Estatus = "Activo";
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Estatus = "Inactivo";
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        // GET : apiToken
        [HttpPost("token")]
        public async Task<ActionResult<TokenDto>> Token()
        {
            // Ver si existe token en las cookies
            if (Request.Cookies.ContainsKey("token"))
            {
                var token = Request.Cookies["token"];
                var tokenDto = TokenService.ReadToken(token);
                return tokenDto;
            }
            else
            {
                return NotFound();
            }
        }
    }
}
