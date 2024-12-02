import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Sala {
  nome: string;
}

interface Reserva {
  id: string;
  sala: Sala;
  dataHoraInicio: string;
  dataHoraFim: string;
}

const ReservaForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState<Reserva>({
    id: '',
    sala: { nome: '' },
    dataHoraInicio: '',
    dataHoraFim: '',
  });
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    const buscarSalas = async () => {
      try {
        const response = await api.get('/sala/listar');
        setSalas(response.data);
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
        // Exibir mensagem de erro para o usuário
      }
    };

    const buscarReserva = async () => {
      if (id) {
        try {
          const response = await api.get(`/reserva/buscar/${id}`);
          setReserva(response.data);
        } catch (error) {
          console.error('Erro ao buscar reserva:', error);
          // Exibir mensagem de erro para o usuário
        }
      }
    };

    buscarSalas();
    buscarReserva();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (id) {
        await api.put(`/reserva/alterar/${id}`, reserva);
      } else {
        await api.post('/reserva/cadastrar', reserva);
      }
      navigate('/reservas'); // Redireciona para a página de reservas após o cadastro/edição
    } catch (error) {
      console.error('Erro ao cadastrar/editar reserva:', error);
      // Exibir mensagem de erro para o usuário
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="sala">Sala:</label>
        <select
          id="sala"
          value={reserva.sala.nome}
          onChange={(e) => setReserva({ ...reserva, sala: { nome: e.target.value } })}
          required
        >
          <option value="">Selecione uma sala</option>
          {salas.map((sala) => (
            <option key={sala.nome} value={sala.nome}>
              {sala.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dataHoraInicio">Início:</label>
        <input
          type="datetime-local"
          id="dataHoraInicio"
          value={reserva.dataHoraInicio}
          onChange={(e) => setReserva({ ...reserva, dataHoraInicio: e.target.value })}
          required
        />
      </div>
      <div>
        <label htmlFor="dataHoraFim">Fim:</label>
        <input
          type="datetime-local"
          id="dataHoraFim"
          value={reserva.dataHoraFim}
          onChange={(e) => setReserva({ ...reserva, dataHoraFim: e.target.value })}
          required
        />
      </div>
      <button type="submit">{id ? 'Atualizar' : 'Cadastrar'}</button>
    </form>
  );
};

export default ReservaForm;