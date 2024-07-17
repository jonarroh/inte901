using Server.Models;
using System;
using System.Linq;

namespace Server.lib
{
    public class CreditCardService
    {
        public static CreditCard[] creditCards =
        [
            new CreditCard
            {
                Id = 1,
                CardHolderName = "Juan Perez",
                CVV = "568",
                CardNumber = "1234567890123456",
                ExpiryDate = "12/23",
                UserId = 1
            },
            new CreditCard
            {
                Id = 2,
                CVV = "153",
                CardHolderName = "Maria Lopez",
                CardNumber = "1234567890123456",
                ExpiryDate = "12/23",
                UserId = 2
            },
            new CreditCard
            {
                Id = 3,
                CVV = "123",
                CardHolderName = "Pedro Ramirez",
                CardNumber = "1234567890123456",
                ExpiryDate = "12/23",
                UserId = 3
            }
        ];

        public bool IsValidCreditCard(CreditCard creditCard)
        {
            return !string.IsNullOrEmpty(creditCard.CardHolderName) &&
                   !string.IsNullOrEmpty(creditCard.CardNumber) &&
                   !string.IsNullOrEmpty(creditCard.ExpiryDate) &&
                   !string.IsNullOrEmpty(creditCard.CVV) &&
                   !string.IsNullOrEmpty(creditCard.Amount);
        }

        public bool IsCorrectCvv(CreditCard creditCard)
        {
            if (creditCard == null || string.IsNullOrEmpty(creditCard.CVV))
            {
                return false;
            }

            if (!creditCard.CVV.All(char.IsDigit) || creditCard.CVV.Length != 3)
            {
                return false;
            }

            // Ver si existe la tarjeta con el CVV en la base de datos
            return creditCards.Any(card => card.CVV == creditCard.CVV);
        }

        public bool IsCorrectExpiryDate(CreditCard creditCard)
        {
            if (creditCard == null || string.IsNullOrEmpty(creditCard.ExpiryDate))
            {
                return false;
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(creditCard.ExpiryDate, @"^\d{2}/\d{2}$"))
            {
                return false;
            }

            // Ver si existe la tarjeta con la fecha de expiración en la base de datos
            return creditCards.Any(card => card.ExpiryDate == creditCard.ExpiryDate);
        }

        public static string OcultaNumero(string numero)
        {
            if (string.IsNullOrEmpty(numero) || numero.Length != 16)
            {
                throw new ArgumentException("El número de tarjeta debe tener 16 dígitos.");
            }

            return string.Concat(numero.AsSpan()[..4], "********", numero.AsSpan(12, 4));
        }

        // Agregar método para obtener tarjeta por ID
        public static CreditCard? GetCreditCardById(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("El ID de la tarjeta debe ser mayor a 0.");
            }

            if(creditCards == null || creditCards.Length == 0)
            {
                throw new ArgumentException("No hay tarjetas en la base de datos.");
            }


            return creditCards.FirstOrDefault(card => card.Id == id);
        }

        // Agregar método para obtener tarjeta por número de tarjeta
        public CreditCard? GetCreditCardByNumber(string cardNumber)
        {
            return creditCards.FirstOrDefault(card => card.CardNumber == cardNumber);
        }
    }

   
}
