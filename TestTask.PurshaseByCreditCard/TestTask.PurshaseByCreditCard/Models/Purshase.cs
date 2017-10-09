namespace TestTask.PurshaseByCreditCard.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    using TestTask.PurshaseByCreditCard.Constants;

    /// <summary>
    /// Покупка.
    /// </summary>
    public class Purshase : BaseModel, IPurshasePut
    {
        /// <summary>
        /// Номер заказа.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredPurshaseNumber)]
        public int Number { get; set; }

        /// <summary>
        /// Стоимость.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredPurshasePrice)]
        [Range(0, 999999999999999999.99, ErrorMessageResourceName = CResources.RequiredPurshasePrice)]
        public decimal Price { get; set; }

        /// <summary>
        /// Валюта.
        /// </summary>
        public Currency Currency { get; set; }

        /// <summary>
        /// Id кредитной карты.
        /// </summary>
        public Guid? CreditCardId { get; set; }

        /// <summary>
        /// Кредитная карта.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredPurshaseCreditCard)]
        public CreditCard CreditCard { get; set; }

        /// <summary>
        /// Дата выполнения покупки.
        /// </summary>
        public DateTime? CreateTime { get; set; }

        /// <summary>
        /// Обновление данных покупки.
        /// </summary>
        /// <param name="updateData">Данные для обновления.</param>
        /// <returns>Список измененных свойств.</returns>
        public List<string> Update(IPurshasePut updateData)
        {
            var result = new List<string>();
            if (Number != updateData.Number)
            {
                Number = updateData.Number;
                result.Add(nameof(Number));
            }

            if (Price != updateData.Price)
            {
                Price = updateData.Price;
                result.Add(nameof(Price));
            }

            if (Currency != updateData.Currency)
            {
                Currency = updateData.Currency;
                result.Add(nameof(Currency));
            }

            return result;
        }
    }

    public class PurshasePut : BaseModel, IPurshasePut
    {
        /// <summary>
        /// Номер заказа.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredPurshaseNumber)]
        public int Number { get; set; }

        /// <summary>
        /// Стоимость.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredPurshasePrice)]
        [Range(0, 999999999999999999.99, ErrorMessageResourceName = CResources.RequiredPurshasePrice)]
        public decimal Price { get; set; }

        /// <summary>
        /// Валюта.
        /// </summary>
        public Currency Currency { get; set; }
    }

    /// <summary>
    /// Интерфейс для обновления данных покупки без данных карты.
    /// </summary>
    public interface IPurshasePut
    {
        /// <summary>
        /// Идентификатор.
        /// </summary>
        Guid? Id { get; set; }

        /// <summary>
        /// Номер заказа.
        /// </summary>
        int Number { get; set; }

        /// <summary>
        /// Стоимость.
        /// </summary>
        decimal Price { get; set; }

        /// <summary>
        /// Валюта.
        /// </summary>
        Currency Currency { get; set; }
    }

    /// <summary>
    /// Результат операции выполнения покупки. 
    /// </summary>
    public class PurshasePostResult
    {
        /// <summary>
        /// Флаг успешности выполнения операции.
        /// </summary>
        public bool Succeed { get; set; }

        /// <summary>
        /// Ошибка валидации.
        /// </summary>
        public string ValidationError { get; set; }

        /// <summary>
        /// Конструтор.
        /// </summary>
        /// <param name="succeed">Флаг успешности выполнения операции.</param>
        /// <param name="validationError">Ошибка валидации.</param>
        public PurshasePostResult(bool succeed = true, string validationError = null)
        {
            Succeed = succeed;
            ValidationError = validationError;
        }

        /// <summary>
        /// Конструктор ошибки валидации.
        /// </summary>
        /// <param name="validationError">Ошибка валидации.</param>
        public PurshasePostResult(string validationError) : this(false, validationError)
        {
        }
    }
}
