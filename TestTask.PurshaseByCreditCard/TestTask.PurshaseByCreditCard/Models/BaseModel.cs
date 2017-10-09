namespace TestTask.PurshaseByCreditCard.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    using TestTask.PurshaseByCreditCard.Constants;

    /// <summary>
    /// Базовая модель.
    /// </summary>
    public abstract class BaseModel
    {
        /// <summary>
        /// Идентификатор.
        /// </summary>
        [Required(ErrorMessageResourceName = CResources.RequiredModelId)]
        public Guid? Id { get; set; } = Guid.NewGuid();
    }
}
