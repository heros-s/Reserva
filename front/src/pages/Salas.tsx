import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SalaForm from '../components/SalaForm';

interface Sala {
  id: string;
  nome: string;
  capacidade: number;
}

const Salas: React.FC = () => {
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    const buscarSalas = async () => {
      const response = await api.get('/sala/listar');
      setSalas(response.data);
    };
    buscarSalas();
  }, []);

  const handleRemoverSala = async (nome: string) => {
    try {
      await api.delete('/sala/remover', { data: { nome } });
      setSalas(salas.filter((sala) => sala.nome !== nome));
    } catch (error) {
      console.error(error);
      // Exibir mensagem de erro
    }
  };

  return (
    <div>
      <h1>Salas</h1>
      <Link to="/salas/cadastrar">Cadastrar Sala</Link>
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
                <Link to={`/salas/editar/${sala.nome}`}>Editar</Link>
                <button onClick={() => handleRemoverSala(sala.nome)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Renderize o formulário para cadastro ou edição */}
      <SalaForm />
    </div>
  );
};

export default Salas;