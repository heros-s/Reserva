import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface Sala {
  id: string;
  nome: string;
  capacidade: number;
}

const SalaForm: React.FC = () => {
  const { nome } = useParams();
  const [sala, setSala] = useState<Sala>({
    id: '',
    nome: '',
    capacidade: 0,
  });

  useEffect(() => {
    const buscarSala = async () => {
      if (nome) {
        const response = await api.get(`/sala/buscar/${nome}`);
        setSala(response.data);
      }
    };
    buscarSala();
  }, [nome]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (nome) {
        await api.put(`/sala/alterar/${nome}`, sala);
      } else {
        await api.post('/sala/cadastrar', sala);
      }
      // Redirecionar ou exibir mensagem de sucesso
    } catch (error) {
      console.error(error);
      // Exibir mensagem de erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          value={sala.nome}
          onChange={(e) => setSala({ ...sala, nome: e.target.value })}
          required
        />
      </div>
      <div>
        <label htmlFor="capacidade">Capacidade:</label>
        <input
          type="number"
          id="capacidade"
          value={sala.capacidade}
          onChange={(e) => setSala({ ...sala, capacidade: parseInt(e.target.value) })}
          min="1"
          required
        />
      </div>
      <button type="submit">{nome ? 'Atualizar' : 'Cadastrar'}</button>
    </form>
  );
};

export default SalaForm;