namespace TestTask.PurshaseByCreditCard.Helpers
{
    using Microsoft.Extensions.Logging;

    public static class LogHelper
    {
        public static ILoggerFactory LoggerFactory { get; } = new LoggerFactory();
        public static ILogger CreateLogger<T>() => LoggerFactory.CreateLogger<T>();
    }
}
