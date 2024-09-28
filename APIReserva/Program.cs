// Program.cs

using APIReserva.Classes;
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

    // Atualizar os campos da sala
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

app.Run();

