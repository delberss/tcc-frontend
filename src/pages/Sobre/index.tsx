// About.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

import './index.css';

const About: React.FC = () => {
  return (
    <div className='container-about'>
      <Outlet />
      <div className='sobre-o-projeto'>
        <h2>Sobre o Projeto</h2>
        <p>Este é um projeto para ajudar alunos de computação a
          seguir um caminho de estudos.
          O objetivo é motivar e auxiliar os estudantes dessa área, dessa maneira é utilizado a gamificação
          como elemento principal.
          O aluno pode seguir as dicas de estudos e consequentemente responder alguns questionários para testar
          seus conhecimentos sobre determinado assunto.
          O ranking apresenta os melhores alunos em pontos.
        </p>
      </div>

      <div className='sobre-pontuacoes'>
        <h2>Como ganhar pontos?</h2>
        <ul className='lista-sobre-pontuacoes'>
          <li>Finalize um conteúdo ao responder os questionários</li>
          <li>Finalize um estudo por completo</li>
          <li>Frequente a plataforma todos os dias - A estrela na parte superior direito indica
            seu nível de empenho
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
