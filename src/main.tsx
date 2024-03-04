import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import Estudos from './pages/Estudos';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import Register from './pages/Register';
import InitialQuestionario from './pages/InitialQuestionario';
import { AuthProvider } from './AuthContext';
import Ranking from './pages/Ranking';
import EstudosGenerico from './pages/Estudos/Conteudo';
import Questionario from './pages/Estudos/Conteudo/Questionario';
import Home from './pages/Home';
import Conquistas from './pages/Conquistas';

const rootElement = document.getElementById('root') ?? document.createElement('div');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/conquistas" element={<Conquistas />} />
            <Route path="/estudos" element={<Estudos />} />
            <Route path="/estudos/:tipo" element={<EstudosGenerico />} />
            <Route
              path="/estudos/:tipo/:conteudo"
              element={<Questionario />}
            />
            <Route path="/ranking" element={<Ranking />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/form-register" element={<InitialQuestionario />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
