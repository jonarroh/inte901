namespace Server.Models.DTO
{
    public class CreditCardDTO
    {
        public int Id { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CardHolderName { get; set; }

        public int UserId { get; set; }

       
    }
}
