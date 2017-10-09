namespace TestTask.PurshaseByCreditCard.Store
{
    using Microsoft.EntityFrameworkCore;
    using TestTask.PurshaseByCreditCard.Models;

    public class AppDbContext : DbContext
    {
        public DbSet<CreditCard> CreditCards { get; set; }

        public DbSet<Purshase> Purshases { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CreditCard>().ToTable(nameof(CreditCard));
            modelBuilder.Entity<Purshase>().ToTable(nameof(Purshase));
            modelBuilder.Entity<Purshase>().HasIndex(x => new { x.CreateTime }).IsUnique(false);
        }

        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();
            context.SaveChanges();
        }
    }
}
