using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Espacio
    {
        [Key]
        [Required]
        public int idEspacio { get; set; }

        [Required]
        public string nombre { get; set; }

        [Required]
        public int canPersonas { get; set; }

        [Required]
        public double precio { get; set; }

        [Required]
        public string estatus { get; set; }

        [Required]
        public string descripcion { get; set; }
    }
}
