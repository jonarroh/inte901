using Server.Models.Usuario.Server.Models.Usuario;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models.DTO
{
    public class ChatDTO
    {
        public int? Id { get; set; }
        public int? IdUsuario { get; set; }
        public string? Menssaje { get; set; }
        public string? Rol { get; set; }
        public DateTime? Fecha { get; set; }
        public String? ConversacionId { get; set; }
    }
}
