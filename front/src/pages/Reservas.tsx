import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Reserva {
  id: string;
  sala: {
    nome: string;
  };
  dataHoraInicio: string;
  dataHoraFim: string;
}

const Reservas: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    const buscarReservas = async () => {
      try {
        const response = await api.get('/reserva/listar');
        setReservas(response.data);
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        // Exibir mensagem de erro para o usuário
      }
    };
    buscarReservas();
  }, []);

  const handleRemoverReserva = async (id: string) => {
    try {
      await api.delete(`/reserva/remover/${id}`);
      setReservas(reservas.filter((reserva) => reserva.id !== id));
    } catch (error) {
      console.error('Erro ao remover reserva:', error);
      // Exibir mensagem de erro para o usuário
    }
  };

  return (
    <div>
      <h1>Reservas</h1>
      <Link to="/reservas/cadastrar">Cadastrar Reserva</Link>
      <table>
        <thead>
          <tr>
            <th>Sala</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.sala.nome}</td>
              <td>{reserva.dataHoraInicio}</td>
              <td>{reserva.dataHoraFim}</td>
              <td>
                <Link to={`/reservas/editar/${reserva.id}`}>Editar</Link>
                <button onClick={() => handleRemoverReserva(reserva.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservas;