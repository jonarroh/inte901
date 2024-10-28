using Server.Models.Usuario.Server.Models.Usuario;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class Chat
    {
        [Key]
        [Required]
        public int? Id { get; set; }
        [Required]
        public int? IdUsuario { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [Required]
        public string? Mensaje { get; set; }
        [Required]
        public string? Rol { get; set; }
        [Required]
        public DateTime? Fecha { get; set; }
        [Required]
        public string? ConversacionId { get; set; } 
    }
}
