using System.ComponentModel.DataAnnotations;

namespace Server.models
{
    public class Test
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
