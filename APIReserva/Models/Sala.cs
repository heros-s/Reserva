// Sala.cs

namespace APIReserva.Models;

public class Sala
{
    public Sala()
    {
        Id = Guid.NewGuid().ToString();
        CriadoEm = DateTime.Now;
    }        

    public string? Id { get; set; }
    public string? Nome { get; set; }
    public int Capacidade { get; set; }
    public DateTime CriadoEm { get; set; }
}