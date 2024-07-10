using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Espacio
    {
        [Key]
        [Required]
<<<<<<< HEAD
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
=======
        public int? idEspacio { get; set; }
        
        [Required]
        public string? nombre { get; set; }

        [Required]
        public int? canPersonas {  get; set; }
        
        [Required]
        public double? precio { get; set; }

        [Required]
        public string? estatus { get; set; }

>>>>>>> 88e1a8911d75b8a665bdfee0c40e377ed0b4f7b7
    }
}
