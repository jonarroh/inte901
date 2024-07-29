namespace Server.Models.DTO
{
    public class DetailReservaDTO
    {
        public int idDetailReser { get; set; }
        public DateTime fecha { get; set; }
        public string horaInicio { get; set; }
        public string horaFin { get; set; }
        public int idEspacio { get; set; }
    }
}
