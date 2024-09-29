// Program.cs

using APIReserva.Models;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

List<Sala> salas = new List<Sala>
        {
            new Sala { Nome = "Sala 1 Transparencia", Capacidade = 2, CriadoEm = DateTime.Now.AddDays(-1) },
            new Sala { Nome = "Sala 2 - Flexibilidade", Capacidade = 3, CriadoEm = DateTime.Now.AddDays(-2) },
            new Sala { Nome = "Sala 3 - Relacionamento", Capacidade = 5, CriadoEm = DateTime.Now.AddDays(-3) },
            new Sala { Nome = "Sala 4 - Inovacao", Capacidade = 4, CriadoEm = DateTime.Now.AddDays(-4) },
            new Sala { Nome = "Arquibancada", Capacidade = 12, CriadoEm = DateTime.Now.AddDays(-5) },
        };

List<Reserva> reservas = new List<Reserva>();

//GET: /
app.MapGet("/", () => "API de Salas");

//GET: /api/sala/listar
app.MapGet("/api/sala/listar", () =>
{
    if(salas.Count > 0)
    {
        return Results.Ok(salas);
    }
    return Results.NotFound();
});

//POST: /api/sala/cadastrar/
app.MapPost("/api/sala/cadastrar", ([FromBody] Sala sala) =>
{
    salas.Add(sala);
    return Results.Created("", sala);
});

//POST: /api/sala/remover
app.MapDelete("/api/sala/remover", ([FromBody] Sala sala) =>
{
    var salaParaRemover = salas.FirstOrDefault(p => p.Nome == sala.Nome);
    if (salaParaRemover != null)
    {
        salas.Remove(salaParaRemover);
        return Results.NoContent();
    }
    return Results.NotFound();
});

// PUT: /api/sala/alterar/{nome}
app.MapPut("/api/sala/alterar/{nome}", ([FromRoute] string nome, [FromBody] Sala salaAtualizada) =>
{
    var sala = salas.FirstOrDefault(p => p.Nome.Equals(nome, StringComparison.OrdinalIgnoreCase));
    if (sala == null)
    {
        return Results.NotFound(new { message = $"Sala com nome '{nome}' não encontrada." });
    }

    sala.Nome = salaAtualizada.Nome;
    sala.Capacidade = salaAtualizada.Capacidade;

    return Results.Ok(new { message = "Sala atualizada com sucesso.", sala });
});

//POST: /api/sala/buscar/{nome}
app.MapGet("/api/sala/buscar/{nome}", (string nome) =>
{
    var sala = salas.FirstOrDefault(p => p.Nome == nome);
    if (sala != null)
    {
        return Results.Ok(sala);
    }
    return Results.NotFound();
});

//POST: /api/reserva/cadastrar
app.MapPost("/api/reserva/cadastrar", ([FromBody] Reserva reserva) =>
{
    var sala = salas.FirstOrDefault(p => p.Nome.Equals(reserva.NomeSala, StringComparison.OrdinalIgnoreCase));
    if (sala == null)
    {
        return Results.NotFound(new { message = $"Sala com nome '{reserva.NomeSala}' não encontrada." });
    }

    // Verificar se já existe uma reserva para a sala no intervalo de tempo especificado
    var conflitoReserva = reservas.Any(r =>
        r.NomeSala.Equals(reserva.NomeSala, StringComparison.OrdinalIgnoreCase) &&
        ((reserva.DataInicio >= r.DataInicio && reserva.DataInicio < r.DataFim) ||
        (reserva.DataFim > r.DataInicio && reserva.DataFim <= r.DataFim) ||
        (reserva.DataInicio <= r.DataInicio && reserva.DataFim >= r.DataFim)));

    if (conflitoReserva)
    {
        return Results.Conflict(new { message = "Já existe uma reserva para esta sala no intervalo de tempo especificado." });
    }

    reservas.Add(reserva);
    return Results.Created("", reserva);
});
//GET: /api/reserva/listar
app.MapGet("/api/reserva/listar", () =>
{
    if (reservas.Count > 0)
    {
        return Results.Ok(reservas);
    }
    return Results.NotFound();
});

//GET: /api/reserva/buscar/{id}
app.MapGet("/api/reserva/buscar/{id}", (string id) =>
{
    var reserva = reservas.FirstOrDefault(r => r.Id == id);
    if (reserva != null)
    {
        return Results.Ok(reserva);
    }
    return Results.NotFound();
});

//DELETE: /api/reserva/remover/{id}
app.MapDelete("/api/reserva/remover/{id}", (string id) =>
{
    var reserva = reservas.FirstOrDefault(r => r.Id == id);
    if (reserva != null)
    {
        reservas.Remove(reserva);
        return Results.NoContent();
    }
    return Results.NotFound();
});

app.Run();

