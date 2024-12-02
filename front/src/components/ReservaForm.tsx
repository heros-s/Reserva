import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
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
  const { control, handleSubmit, reset } = useForm<Reserva>();
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    const buscarSalas = async () => {
      try {
        const response = await api.get('/sala/listar');
        setSalas(response.data);
      } catch (error) {
        toast.error('Erro ao buscar salas');
      }
    };

    const buscarReserva = async () => {
      if (id) {
        try {
          const response = await api.get(`/reserva/buscar/${id}`);
          reset(response.data);
        } catch (error) {
          toast.error('Erro ao buscar reserva');
        }
      }
    };

    buscarSalas();
    buscarReserva();
  }, [id, reset]);

  const onSubmit = async (data: Reserva) => {
    try {
      if (id) {
        await api.put(`/reserva/alterar/${id}`, data);
        toast.success('Reserva atualizada com sucesso');
      } else {
        await api.post('/reserva/cadastrar', data);
        toast.success('Reserva cadastrada com sucesso');
      }
      navigate('/reservas');
    } catch (error) {
      toast.error('Erro ao cadastrar/editar reserva');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="sala">Sala:</label>
        <Controller
          name="sala.nome"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <select {...field} required>
              <option value="">Selecione uma sala</option>
              {salas.map((sala) => (
                <option key={sala.nome} value={sala.nome}>
                  {sala.nome}
                </option>
              ))}
            </select>
          )}
        />
      </div>
      <div>
        <label htmlFor="dataHoraInicio">Início:</label>
        <Controller
          name="dataHoraInicio"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input type="datetime-local" {...field} required />
          )}
        />
      </div>
      <div>
        <label htmlFor="dataHoraFim">Fim:</label>
        <Controller
          name="dataHoraFim"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input type="datetime-local" {...field} required />
          )}
        />
      </div>
      <button type="submit">{id ? 'Atualizar' : 'Cadastrar'}</button>
    </form>
  );
};

export default ReservaForm;