using Server.Models.Usuario.Server.Models.Usuario;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.DTO
{
    public class ChatDTO
    {
        public int? Id { get; set; }
        public int? IdUsuario { get; set; }
        public string? Mensaje { get; set; }
        public string? Rol { get; set; }
        public DateTime? Fecha { get; set; }
        public string? ConversacionId { get; set; }
        public string? NombreCompleto { get; set; }
        public string? Email { get; set; }
    }
}
