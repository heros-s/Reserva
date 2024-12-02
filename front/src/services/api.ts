import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5136/APIReserva', // Substitua pela URL da sua API
});

export default api;