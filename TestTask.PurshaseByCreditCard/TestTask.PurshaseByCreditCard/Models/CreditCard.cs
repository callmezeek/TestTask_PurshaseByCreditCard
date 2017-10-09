namespace TestTask.PurshaseByCreditCard.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    using TestTask.PurshaseByCreditCard.Constants;

    /// <summary>
    /// Кредитная карта.
    /// </summary>
    public class CreditCard : BaseModel
    {
        /// <summary>
        /// Номер.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredCreditCardNumber)]
        [RegularExpression(@"(^[0-9]{16}$)|(^[0-9]{19}$)", ErrorMessageResourceName = CResources.FormatErrorCreditCardNumber)]
        public string Number { get; set; }

        /// <summary>
        /// Держатель карты.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredCreditCardHolder)]
        public string Cardholder { get; set; }

        /// <summary>
        /// Месяц срока действия.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredCreditCardExpDateMonth)]
        [Range(0, 11, ErrorMessage = CResources.FormatErrorCreditCardExpDateMonth)]
        public byte ExpDateMonth { get; set; }

        /// <summary>
        /// Год срока действия.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredCreditCardExpDateYear)]
        [Range(2000, 9999, ErrorMessageResourceName = CResources.FormatErrorCreditCardExpDateYear)]
        public Int16 ExpDateYear { get; set; }

        /// <summary>
        /// Код CVV.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredCreditCardCvv)]
        [RegularExpression("^[0-9]{3,4}$", ErrorMessageResourceName = CResources.FormatErrorCvv)]
        [MaxLength(4, ErrorMessageResourceName = CResources.FormatErrorCvv)]
        public string Cvv { get; set; }
    }
}
