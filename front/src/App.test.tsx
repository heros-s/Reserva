import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza o link Aprenda React', () => {
  render(<App />);
  const linkElement = screen.getByText(/Aprenda React/i);
  expect(linkElement).toBeInTheDocument();
});

test('renderiza o título Salas Disponíveis', () => {
  render(<App />);
  const titleElement = screen.getByText(/Salas Disponíveis/i);
  expect(titleElement).toBeInTheDocument();
});
