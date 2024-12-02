import React, { useState } from "react";

function Reserva({ reservas, setReservas, salas }) {
  const [nomeSala, setNomeSala] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [nomePessoa, setNomePessoa] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reserva = { nomeSala, dataInicio, dataFim, nomePessoa };

    try {
      const response = await fetch("/api/reserva/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      if (response.ok) {
        const data = await response.json();
        setReservas([...reservas, data]);
        limparCampos();
      } else {
        console.error("Erro ao salvar reserva:", response.status);
      }
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/reserva/remover/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReservas(reservas.filter((reserva) => reserva.id !== id));
      } else {
        console.error("Erro ao excluir reserva:", response.status);
      }
    } catch (error) {
      console.error("Erro ao excluir reserva:", error);
    }
  };

  const limparCampos = () => {
    setNomeSala("");
    setDataInicio("");
    setDataFim("");
    setNomePessoa("");
  };

  return (
    <div>
      <h2>Reservas</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nomeSala">Nome da Sala:</label>
          <select
            id="nomeSala"
            value={nomeSala}
            onChange={(e) => setNomeSala(e.target.value)}
            required
          >
            <option value="">Selecione uma sala</option>
            {salas.map((sala) => (
              <option key={sala.id} value={sala.nome}>
                {sala.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dataInicio">Data de Início:</label>
          <input
            type="datetime-local"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="dataFim">Data de Fim:</label>
          <input
            type="datetime-local"
            id="dataFim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="nomePessoa">Nome da Pessoa:</label>
          <input
            type="text"
            id="nomePessoa"
            value={nomePessoa}
            onChange={(e) => setNomePessoa(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reservar</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Sala</th>
            <th>Data de Início</th>
            <th>Data de Fim</th>
            <th>Nome da Pessoa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.nomeSala}</td>
              <td>{reserva.dataInicio}</td>
              <td>{reserva.dataFim}</td>
              <td>{reserva.nomePessoa}</td>
              <td>
                <button onClick={() => handleDelete(reserva.id)}>
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reserva;