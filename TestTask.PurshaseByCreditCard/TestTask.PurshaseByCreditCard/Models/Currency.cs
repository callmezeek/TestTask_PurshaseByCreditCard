namespace TestTask.PurshaseByCreditCard.Models
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    /// <summary>
    /// Валюта.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Currency
    {
        /// <summary>
        /// Рубли.
        /// </summary>
        RUB = 0,

        /// <summary>
        /// Доллары.
        /// </summary>
        USD = 1
    }
}
