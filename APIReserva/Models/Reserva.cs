// Reserva.cs

namespace APIReserva.Models;

public class Reserva
{
    public Reserva()
    {
        Id = Guid.NewGuid().ToString();
        CriadoEm = DateTime.Now;
    }

    public string Id { get; set; }
    public string NomeSala { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public string NomePessoa { get; set; }
    public DateTime CriadoEm { get; set; }
}