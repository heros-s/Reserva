using APIReserva.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configurar SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Aplicar migrações
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

//GET: /
app.MapGet("/", () => "API de Salas");

//GET: /api/sala/listar
app.MapGet("/api/sala/listar", async (AppDbContext db) =>
{
    var salas = await db.Salas.ToListAsync();
    if (salas.Count > 0)
    {
        return Results.Ok(salas);
    }
    return Results.NotFound();
});

//POST: /api/sala/cadastrar/
app.MapPost("/api/sala/cadastrar", async (AppDbContext db, [FromBody] Sala sala) =>
{
    db.Salas.Add(sala);
    await db.SaveChangesAsync();
    return Results.Created("", sala);
});

//POST: /api/sala/remover
app.MapDelete("/api/sala/remover", async (AppDbContext db, [FromBody] Sala sala) =>
{
    var salaParaRemover = await db.Salas.FirstOrDefaultAsync(p => p.Nome == sala.Nome);
    if (salaParaRemover != null)
    {
        db.Salas.Remove(salaParaRemover);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

// PUT: /api/sala/alterar/{nome}
app.MapPut("/api/sala/alterar/{nome}", async (AppDbContext db, [FromRoute] string nome, [FromBody] Sala salaAtualizada) =>
{
    var sala = await db.Salas.FirstOrDefaultAsync(p => p.Nome.ToLower() == nome.ToLower());
    if (sala == null)
    {
        return Results.NotFound();
    }

    sala.Nome = salaAtualizada.Nome;
    sala.Capacidade = salaAtualizada.Capacidade;

    await db.SaveChangesAsync();
    return Results.Ok(sala);
});

//GET: /api/sala/buscar/{nome}
app.MapGet("/api/sala/buscar/{nome}", async (AppDbContext db, string nome) =>
{
    var sala = await db.Salas.FirstOrDefaultAsync(p => p.Nome.ToLower() == nome.ToLower());
    if (sala != null)
    {
        return Results.Ok(sala);
    }
    return Results.NotFound();
});

//POST: /api/reserva/cadastrar
app.MapPost("/api/reserva/cadastrar", async (AppDbContext db, [FromBody] Reserva reserva) =>
{
    var sala = await db.Salas.FirstOrDefaultAsync(p => p.Nome.ToLower() == reserva.NomeSala.ToLower());
    if (sala == null)
    {
        return Results.NotFound(new { message = $"Sala com nome '{reserva.NomeSala}' não encontrada." });
    }

    // Verificar se já existe uma reserva para a sala no intervalo de tempo especificado
    var conflitoReserva = await db.Reservas.AnyAsync(r =>
        r.NomeSala.ToLower() == reserva.NomeSala.ToLower() &&
        ((reserva.DataInicio >= r.DataInicio && reserva.DataInicio < r.DataFim) ||
        (reserva.DataFim > r.DataInicio && reserva.DataFim <= r.DataFim) ||
        (reserva.DataInicio <= r.DataInicio && reserva.DataFim >= r.DataFim)));

    if (conflitoReserva)
    {
        return Results.Conflict(new { message = "Já existe uma reserva para esta sala no intervalo de tempo especificado." });
    }

    db.Reservas.Add(reserva);
    await db.SaveChangesAsync();
    return Results.Created("", reserva);
});

//GET: /api/reserva/listar
app.MapGet("/api/reserva/listar", async (AppDbContext db) =>
{
    var reservas = await db.Reservas.ToListAsync();
    if (reservas.Count > 0)
    {
        return Results.Ok(reservas);
    }
    return Results.NotFound();
});

//GET: /api/reserva/buscar/{id}
app.MapGet("/api/reserva/buscar/{id}", async (AppDbContext db, string id) =>
{
    var reserva = await db.Reservas.FirstOrDefaultAsync(r => r.Id == id);
    if (reserva != null)
    {
        return Results.Ok(reserva);
    }
    return Results.NotFound();
});

//DELETE: /api/reserva/remover/{id}
app.MapDelete("/api/reserva/remover/{id}", async (AppDbContext db, string id) =>
{
    var reserva = await db.Reservas.FirstOrDefaultAsync(r => r.Id == id);
    if (reserva != null)
    {
        db.Reservas.Remove(reserva);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

app.Run();
