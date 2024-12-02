import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Salas from './pages/Salas';
import Reservas from './pages/Reservas';
import SalaForm from './components/SalaForm';
import ReservaForm from './components/ReservaForm';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/salas/cadastrar" element={<SalaForm />} />
        <Route path="/salas/editar/:nome" element={<SalaForm />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/reservas/cadastrar" element={<ReservaForm />} />
        <Route path="/reservas/editar/:id" element={<ReservaForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;