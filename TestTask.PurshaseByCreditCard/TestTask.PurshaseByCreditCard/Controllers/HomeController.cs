namespace TestTask_PurshaseByCreditCard.Controllers
{
    using System;
    using System.Diagnostics;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Localization;
    using Microsoft.Extensions.Localization;
    using Microsoft.Extensions.Logging;

    using TestTask.PurshaseByCreditCard;
    using TestTask.PurshaseByCreditCard.Helpers;
    
    public class HomeController : Controller
    {
        private readonly IStringLocalizer<SharedResource> _localizer;

        private static ILogger Logger { get; } = LogHelper.CreateLogger<HomeController>();

        public HomeController(IStringLocalizer<SharedResource> localizer)
        {
            _localizer = localizer;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }

        [Route("api/Home/SetLanguage")]
        public IActionResult SetLanguage(string culture)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );

            var needError = false;
            if (needError)
            {
                throw new Exception();
            }

            return new OkResult();
        }
    }
}
