import React, { useState, useEffect } from 'react';
import './App.css';
import Sala from './components/Sala';
import Reserva from './components/Reserva';

function App() {
    const [salas, setSalas] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [activeTab, setActiveTab] = useState('salas');

    useEffect(() => {
        const fetchSalas = async () => {
            const response = await fetch('/api/sala/listar');
            const data = await response.json();
            setSalas(data);
        };

        const fetchReservas = async () => {
            const response = await fetch('/api/reserva/listar');
            const data = await response.json();
            setReservas(data);
        };

        fetchSalas();
        fetchReservas();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="App">
            <h1>Sistema de Reserva de Salas</h1>
            <nav>
                <button onClick={() => handleTabChange('salas')}>Salas</button>
                <button onClick={() => handleTabChange('reservas')}>Reservas</button>
            </nav>
            {activeTab === 'salas' && (
                <Sala salas={salas} setSalas={setSalas} />
            )}
            {activeTab === 'reservas' && (
                <Reserva reservas={reservas} setReservas={setReservas} salas={salas} />
            )}
        </div>
    );
}

export default App;