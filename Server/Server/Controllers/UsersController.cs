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

        public UsersController(Context context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            // Agregar direcciones a cada usuario
            foreach (var user in users)
            {
                user.Direcciones = await _context.Direcciones.Where(d => d.UserId == user.Id).ToListAsync();
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
                    CreditCards = await _context.CreditCard.Where(c => c.UserId == u.Id).Select(c => new CreditCardDTO
                    {
                        Id = c.Id,
                        CardHolderName = c.CardHolderName,
                        CardNumber = ocultaNumero(c.CardNumber),
                        ExpiryDate = c.ExpiryDate,
                        UserId = c.UserId
                    }).ToListAsync()
                };

                usersDTO.Add(userDTO);
            }

            return Ok(usersDTO);
        }


        private static string ocultaNumero(string CardNumber)
        {
            return "**** **** **** " + CardNumber.Substring(CardNumber.Length - 4);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
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

            return NoContent();
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            user.Password = StringToSha256(user.Password);
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

            _context.Users.Remove(user);
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
            //ver si existe token en las cookies
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
