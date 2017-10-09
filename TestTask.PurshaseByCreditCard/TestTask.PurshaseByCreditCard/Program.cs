namespace TestTask_PurshaseByCreditCard
{
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Localization;
    using Microsoft.Extensions.Logging;
    using System;
    using TestTask.PurshaseByCreditCard;
    using TestTask.PurshaseByCreditCard.Constants;
    using TestTask.PurshaseByCreditCard.Store;

    public class Program
    {
        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<AppDbContext>();
                    AppDbContext.Initialize(context);
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    var localizer = services.GetRequiredService<IStringLocalizer<SharedResource>>();
                    logger.LogError(ex, localizer[CResources.ErrorAppDbInit]);
                }
            }

            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
