// About.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

import './index.css';

const About: React.FC = () => {
  return (
    <div className='container-about'>
      <Outlet />
      <div className='sobre-o-projeto'>
        <h2>Sobre o <span>CompTech Gaming</span></h2>
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

      <div className='instrucao-uso'>
        <h2>Instrução de uso - Visão estudante</h2>
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/8XMZvC0HwPA" 
          title="Instrução de uso - Visão estudante"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

      <div className='instrucao-uso'>
        <h2>Instrução de uso - Visão professor</h2>
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/3wp1t5FR2eg" 
          title="Instrução de uso - Visão professor"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

    </div>
  );
};

export default About;
