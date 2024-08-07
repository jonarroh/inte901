using Server.Models;
using System;
using System.Linq;

namespace Server.lib
{
    public class CreditCardService
    {
        public static CheckCreditCard[] creditCards =
        [
            new CheckCreditCard
            {
                Id = 1,
                CardHolderName = "Juan Perez",
                CVV = "568",
                CardNumber = "1234567890123456",
                ExpiryDate = "12/23",
                Amount = 1000 
            },
            new CheckCreditCard
            {
                Id = 2,
                CVV = "153",
                CardHolderName = "Maria Lopez",
                CardNumber = "1234567890123456",
                ExpiryDate = "12/23",
                Amount = 500
            },
            new CheckCreditCard
            {
                Id = 3,
                CVV = "123",
                CardHolderName = "Pedro Ramirez",
                CardNumber = "1234567890123456",
                ExpiryDate = "12/23",
                Amount = 2000
            }
        ];

        public bool IsValidCreditCard(CreditCard creditCard)
        {
            return !string.IsNullOrEmpty(creditCard.CardHolderName) &&
                   !string.IsNullOrEmpty(creditCard.CardNumber) &&
                   !string.IsNullOrEmpty(creditCard.ExpiryDate) &&
                   !string.IsNullOrEmpty(creditCard.CVV);
        }

        public bool CardCanPay (CreditCard creditCard, decimal amount)
        {
            canPay(creditCard, amount);

            return true;
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

            var card = creditCards.FirstOrDefault(card => card.Id == id);

            CreditCard creditCard = new CreditCard
            {
                CardHolderName = card.CardHolderName,
                CardNumber = card.CardNumber,
                CVV = card.CVV,
                ExpiryDate = card.ExpiryDate,
                UserId = card.Id
            };

            return creditCard;
        }

        
        public static bool IsValidAmount(CreditCard creditCard, decimal amount)
        {
            if (creditCard == null)
            {
                return false;
            }

            if (amount <= 0)
            {
                return false;
            }

            // Ver si la tarjeta tiene el monto suficiente
            return creditCards.Any(card => card.Amount >= amount);
        }

        public string canPay(CreditCard creditCard, decimal amount)
        {
            if (creditCard == null)
            {
                return "La tarjeta no puede ser nula";
            }

            if (amount <= 0)
            {
                return "El monto debe ser mayor a 0";
            }

            if (!IsValidCreditCard(creditCard))
            {
                return "La tarjeta no es válida";
            }

            if (!IsCorrectCvv(creditCard))
            {
                return "El CVV no es correcto";
            }

            if (!IsCorrectExpiryDate(creditCard))
            {
                return "La fecha de expiración no es correcta";
            }

            if (!IsValidAmount(creditCard, amount))
            {
                return "La tarjeta no tiene el monto suficiente";
            }

            //ver si el id de la tarjeta y el cvv coinciden

            if (creditCards.Any(card => card.Id == creditCard.UserId && card.CVV == creditCard.CVV))
            {
                return "La tarjeta es válida";
            }
            if (creditCards.Any(card => card.Id == creditCard.UserId && card.CVV != creditCard.CVV))
            {
                return "El CVV no es correcto";
            }

            return "La tarjeta es válida";
        }


    }

   
}
