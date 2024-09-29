// AppDBContext.cs

using Microsoft.EntityFrameworkCore;

namespace APIReserva.Models
{
    public class AppDbContext : DbContext
    {
        public DbSet<Sala> Salas { get; set; }
        public DbSet<Reserva> Reservas { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
