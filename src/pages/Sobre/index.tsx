// About.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

import './index.css';

const About: React.FC = () => {
  return (
    <div className='container-about'>
      <Outlet/>
      <h2>Sobre o Projeto</h2>
      <p>Este é um projeto de trabalho de conclusão de curso criado para ajudar alunos de computação a seguir um caminho de estudos.
        O objetivo é motivar e auxiliar os estudantes dessa área, dessa maneira é utilizado a gamificação 
        como elemento principal.
        O aluno pode seguir as dicas de estudos e consequentemente responder alguns questionários,
        dessa maneira ele ganha pontos na plataforma e assim subindo de nível. 
        Além disso, ele disputa com outros alunos no ranking geral.
      </p>
    </div>
  );
};

export default About;
