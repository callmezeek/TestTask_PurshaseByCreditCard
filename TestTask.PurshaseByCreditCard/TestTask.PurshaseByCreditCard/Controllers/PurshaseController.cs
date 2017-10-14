namespace TestTask.PurshaseByCreditCard.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Localization;
    using Microsoft.Extensions.Logging;

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using TestTask.PurshaseByCreditCard.Constants;
    using TestTask.PurshaseByCreditCard.Helpers;
    using TestTask.PurshaseByCreditCard.Models;
    using TestTask.PurshaseByCreditCard.Store;

    [Route("api/[controller]")]
    public class PurshaseController : Controller
    {
        #region Приватные поля и свойства

        private readonly IStringLocalizer<SharedResource> _localizer;

        private readonly AppDbContext _context;

        private static ILogger Logger { get; } = LogHelper.CreateLogger<PurshaseController>();

        #endregion

        #region Приватные методы

        /// <summary>
        /// Получить результат запроса по коду и данным.
        /// </summary>
        /// <param name="code">Код результата.</param>
        /// <param name="data">Данные результата.</param>
        /// <returns>Результат запроса.</returns>
        private JsonResult GetResultByCodeAndData(int code, object data = null)
        {
            return new JsonResult(data) { StatusCode = code };
        }

        /// <summary>
        /// Кастомная валидация и бизнес-логика покупки перед сохранением.
        /// </summary>
        /// <param name="purshase">Покупка.</param>
        /// <returns>Результат проверки.</returns>
        private async Task<PurshasePostResult> ValidatePurshaseBeforeSave(IPurshasePut purshase, bool isNew = true)
        {
            // Проверка отсутствия выполненной покупки по заказу  этим же номером.
            if (await _context.Purshases.AnyAsync(x => x.Id != purshase.Id && x.Number == purshase.Number))
            {
                return new PurshasePostResult(_localizer[isNew ? CResources.PostPurshaseBLErrorTheSameByNumberIsPayed : CResources.PostPurshaseBLErrorTheSameByNumberIsExists].ToString());
            }

            if (purshase.GetType() == typeof(Purshase))
            {
                var p = (Purshase)purshase;

                // Поиск карты по указанному номеру.
                var existCard = await _context.CreditCards.FirstOrDefaultAsync(x => x.Number == p.CreditCard.Number);
                if (existCard != null)
                {
                    // Привязка найденной карты к покупке.
                    p.CreditCard = existCard;
                    p.CreditCardId = existCard.Id;
                }
            }

            return new PurshasePostResult();
        }

        #endregion

        /// <summary>
        /// Конструктор.
        /// </summary>
        /// <param name="localizer">Экземпляр локализатора.</param>
        /// <param name="context">Экземпляр контекста БД.</param>
        public PurshaseController(IStringLocalizer<SharedResource> localizer, AppDbContext context)
        {
            _context = context;
            _localizer = localizer;
        }

        #region Публичные методы контроллера

        /// <summary>
        /// Получение набора всех покупок.
        /// </summary>
        /// <returns>Набор всех покупок</returns>
        [HttpGet("[action]")]
        public async Task<IEnumerable<Purshase>> GetAllPurshases()
        {
            return await _context.Purshases.Include(x => x.CreditCard).OrderByDescending(x => x.CreateTime).ToListAsync();
        }
        
        /// <summary>
        /// Выполнение и сохранение покупки.
        /// </summary>
        /// <param name="value">Данные покупки.</param>
        /// <returns>Результат выполнения покупки.</returns>
        [HttpPost]
        public async Task<JsonResult> Post([FromBody]Purshase value)
        {
            if (value == null) return GetResultByCodeAndData(400);

            try
            {
                var pResult = await ValidatePurshaseBeforeSave(value);
                if (!pResult.Succeed)
                {
                    return GetResultByCodeAndData(422, pResult);
                }

                // Заполнение даты совершения покупки в UTC.
                value.CreateTime = DateTime.UtcNow;

                // Сохранение данных покупки в БД.
                await _context.Purshases.AddAsync(value);
                await _context.SaveChangesAsync();
                
                return GetResultByCodeAndData(201, pResult);
            }
            catch (Exception e)
            {
                Logger.LogError(e, "Ошибка при обработке процесса выполнения покупки.");
                return GetResultByCodeAndData(500);
            }
        }

        /// <summary>
        /// Обновление данных покупки.
        /// </summary>
        /// <param name="value">Данные покупки.</param>
        /// <returns>Результат выполнения покупки.</returns>
        [HttpPut]
        public async Task<JsonResult> Put([FromBody]PurshasePut value)
        {
            if (value == null) return GetResultByCodeAndData(400);

            try
            {
                // Поиск покупки по Id.
                var existsPurshase = await _context.Purshases.FirstOrDefaultAsync(x => x.Id == value.Id);
                if (existsPurshase == null)
                {
                    // Если покапка с переданным Id не найдена - возвращаем ошибку.
                    return GetResultByCodeAndData(422, new PurshasePostResult(_localizer[CResources.PostPurshaseBLErrorNotExistsById].ToString()));
                }
                
                var pResult = await ValidatePurshaseBeforeSave(value, false);
                if (!pResult.Succeed)
                {
                    return GetResultByCodeAndData(422, pResult);
                }

                var changedProps = existsPurshase.Update(value);
                if (changedProps.Any())
                {
                    // Внесение измнений и сохранение данных покупки в БД.
                    _context.Update(existsPurshase);
                    await _context.SaveChangesAsync();
                }

                return GetResultByCodeAndData(200, pResult);
            }
            catch (Exception e)
            {
                Logger.LogError(e, "Ошибка при обработке процесса выполнения покупки.");
                return GetResultByCodeAndData(500);
            }
        }

        #endregion
    }
}
