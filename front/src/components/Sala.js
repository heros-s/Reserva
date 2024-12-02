import React, { useState, useEffect } from "react";

function Sala({ salas, setSalas }) {
  const [nome, setNome] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [editando, setEditando] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sala = { nome, capacidade };

    try {
      const response = await fetch(
        editando
          ? `/api/sala/alterar/${editando.nome}`
          : "/api/sala/cadastrar",
        {
          method: editando ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sala),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (editando) {
          setSalas(
            salas.map((s) => (s.id === editando.id ? data : s))
          );
        } else {
          setSalas([...salas, data]);
        }
        limparCampos();
      } else {
        console.error("Erro ao salvar sala:", response.status);
      }
    } catch (error) {
      console.error("Erro ao salvar sala:", error);
    }
  };

  const handleEdit = (sala) => {
    setNome(sala.nome);
    setCapacidade(sala.capacidade);
    setEditando(sala);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/sala/remover", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // Corrigido para enviar o ID
      });

      if (response.ok) {
        setSalas(salas.filter((sala) => sala.id !== id));
      } else {
        console.error("Erro ao excluir sala:", response.status);
      }
    } catch (error) {
      console.error("Erro ao excluir sala:", error);
    }
  };

  const limparCampos = () => {
    setNome("");
    setCapacidade("");
    setEditando(null);
  };

  return (
    <div>
      <h2>Salas</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="capacidade">Capacidade:</label>
          <input
            type="number"
            id="capacidade"
            value={capacidade}
            onChange={(e) => setCapacidade(e.target.value)}
            required
          />
        </div>
        <button type="submit">{editando ? "Atualizar" : "Cadastrar"}</button>
        {editando && <button onClick={limparCampos}>Cancelar</button>}
      </form>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Capacidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala) => (
            <tr key={sala.id}>
              <td>{sala.nome}</td>
              <td>{sala.capacidade}</td>
              <td>
                <button onClick={() => handleEdit(sala)}>Editar</button>
                <button onClick={() => handleDelete(sala.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sala;