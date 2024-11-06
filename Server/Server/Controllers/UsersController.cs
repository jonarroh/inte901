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
using Microsoft.AspNetCore.Authorization;
using Server.Models;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Newtonsoft.Json;
using Azure.Core;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    //[Authorize]
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

        public class ChangePasswordRequest
        {
            public string NewPassword { get; set; }
            public int UserId { get; set; }
        }

        [HttpPost("forceChangePassword")]
        public async Task<ActionResult<UserDTO>> ForceChangePassword([FromBody] ChangePasswordRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null || user.Estatus != "Activo")
            {
                return NotFound();
            }

            user.Password = StringToSha256(request.NewPassword);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

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
                                                .Select(c => new CreditCard
                                                {
                                                    Id = c.Id,
                                                    CardHolderName = c.CardHolderName,
                                                    CardNumber = c.CardNumber,
                                                    ExpiryDate = c.ExpiryDate,
                                                    UserId = c.UserId,
                                                    Estatus = c.Estatus,
                                                    CVV = c.CVV
                                                }).ToListAsync()
            };

            return Ok(userDTO);
        }

        [HttpGet]
        [Route("getEmails")]
        public async Task<ActionResult<IEnumerable<string>>> GetEmails()
        {
            var emails = await _context.Users.Where(u => u.Estatus == "Activo").Select(u => u.Email).ToListAsync();
            return emails;
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
                                                .Select(c => new CreditCard
                                                {
                                                    Id = c.Id,
                                                    CardHolderName = c.CardHolderName,
                                                    CardNumber = c.CardNumber,
                                                    ExpiryDate = c.ExpiryDate,
                                                    UserId = c.UserId,
                                                    Estatus = c.Estatus,
                                                    CVV = c.CVV
                                                }).ToListAsync()
                };

                usersDTO.Add(userDTO);
            }

            return Ok(usersDTO);
        }

        [HttpPost("moreActivity")]
        public async Task<ActionResult<IEnumerable<string>>> GetEmailsMoreActivity()
        {
            // Obtiene la lista de actividades agrupadas por usuario
            var groupedActivity = await _context.Logging
                .GroupBy(log => log.IdUser)
                .Select(g => new { IdUser = g.Key, ActivityCount = g.Count() })
                .ToListAsync();

            // Encuentra la cantidad máxima de actividad
            var maxActivityCount = groupedActivity.Max(g => g.ActivityCount);

            // Obtiene los IdUser de los usuarios que tienen la cantidad máxima de actividad
            var mostActiveUserIds = groupedActivity
                .Where(g => g.ActivityCount == maxActivityCount)
                .Select(g => g.IdUser)
                .ToList();

            // Busca los correos electrónicos de estos usuarios
            var emails = await _context.Users
                .Where(u => mostActiveUserIds.Contains(u.Id))
                .Select(u => u.Email)
                .ToListAsync();

            if (emails == null || !emails.Any())
            {
                return NotFound("No se encontraron usuarios con actividad.");
            }

            return Ok(emails);
        }

        // Endpoint para obtener los correos de los usuarios con menos actividad
        [HttpPost("lessActivity")]
        public async Task<ActionResult<IEnumerable<string>>> GetEmailsLessActivity()
        {
            // Obtiene la lista de actividades agrupadas por usuario
            var groupedActivity = await _context.Logging
                .GroupBy(log => log.IdUser)
                .Select(g => new { IdUser = g.Key, ActivityCount = g.Count() })
                .ToListAsync();

            // Encuentra la cantidad mínima de actividad
            var minActivityCount = groupedActivity.Min(g => g.ActivityCount);

            // Obtiene los IdUser de los usuarios que tienen la cantidad mínima de actividad
            var leastActiveUserIds = groupedActivity
                .Where(g => g.ActivityCount == minActivityCount)
                .Select(g => g.IdUser)
                .ToList();

            // Busca los correos electrónicos de estos usuarios
            var emails = await _context.Users
                .Where(u => leastActiveUserIds.Contains(u.Id))
                .Select(u => u.Email)
                .ToListAsync();

            if (emails == null || !emails.Any())
            {
                return NotFound("No se encontraron usuarios con actividad.");
            }

            return Ok(emails);
        }






        [HttpPost("getId")]
        public async Task<ActionResult<UserDTO>> GetUserById([FromBody] String email)
        {

            var user = await _context.Users.Where(u => u.Email == email).FirstOrDefaultAsync();

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
                                                .Select(c => new CreditCard
                                                {
                                                    Id = c.Id,
                                                    CardHolderName = c.CardHolderName,
                                                    CardNumber = c.CardNumber,
                                                    ExpiryDate = c.ExpiryDate,
                                                    UserId = c.UserId,
                                                    Estatus = c.Estatus,
                                                    CVV = c.CVV
                                                }).ToListAsync()
            };

            return userDTO;
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
                                                .Select(c => new CreditCard
                                                {
                                                    Id = c.Id,
                                                    CardHolderName = c.CardHolderName,
                                                    CardNumber = c.CardNumber,
                                                    ExpiryDate = c.ExpiryDate,
                                                    UserId = c.UserId,
                                                    Estatus = c.Estatus,
                                                    CVV = c.CVV
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
                                            .Select(c => new CreditCard
                                            {
                                                Id = c.Id,
                                                CVV = c.CVV,
                                                Estatus = c.Estatus,
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
        public async Task<ActionResult<User>> PostUser([FromBody] UserCaptchaDTO userCaptchaDTO)
        {
            if (!string.IsNullOrEmpty(userCaptchaDTO.CaptchaToken))
            {

                string captchaToken = userCaptchaDTO.CaptchaToken;
                User user = userCaptchaDTO.User;

                // Verificación de reCAPTCHA
                var secretKey = "6LeMsXMqAAAAAAlCAtsRy_mhaQP0HzuL2h4srz8t";
                var client = new HttpClient();
                var response = await client.PostAsync(
                    $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={captchaToken}",
                    null
                );
                var json = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<dynamic>(json);

                if (result.success != true)
                {
                    return BadRequest("ReCAPTCHA no verificado. Intente nuevamente.");
                }
            }
            else
            {
                Console.WriteLine("No se verificó el reCAPTCHA debido a la falta de conexión.");
            }

            string filePath = Path.Combine("lib", "worst_passwords.txt");

            HashSet<string> insecurePasswords = new HashSet<string>(await System.IO.File.ReadAllLinesAsync(filePath));

            if (insecurePasswords.Contains(userCaptchaDTO.User.Password))
            {
                return BadRequest("La contraseña proporcionada es demasiado común. Por favor, elige una contraseña más segura.");
            }

            userCaptchaDTO.User.Password = StringToSha256(userCaptchaDTO.User.Password);
            userCaptchaDTO.User.Estatus = "Activo";
            _context.Users.Add(userCaptchaDTO.User);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = userCaptchaDTO.User.Id }, userCaptchaDTO.User);
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
