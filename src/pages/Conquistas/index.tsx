// About.tsx
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../AuthContext';
import imgConquista1 from '../../assets/1.png'
import imgConquista2 from '../../assets/2.png'
import imgConquista3 from '../../assets/3.png'
import imgConquista4 from '../../assets/4.png'
import imgConquista5 from '../../assets/5.png'
import imgConquista6 from '../../assets/6.png'
import imgConquista7 from '../../assets/7.png'
import imgConquista8 from '../../assets/8.png'
import imgConquista9 from '../../assets/9.png'



const Conquistas: React.FC = () => {
  const { user } = useAuth();
  const [conquistasUsuario, setConquistasUsuario] = useState<Array<{ nome_conquista: string, descricao: string }>>([]);
  const [todasConquistas, setTodasConquistas] = useState<Array<{ nome_conquista: string, descricao: string }>>([]);

  const isConquistaConcluida = (conquista: { nome_conquista: string }) =>
    conquistasUsuario.some((c) => c.nome_conquista === conquista.nome_conquista);

  const renderizarConquistas = (
    conquistas: Array<{ nome_conquista: string, descricao: string }>,
    isConquistaConcluida: (conquista: { nome_conquista: string }) => boolean
  ) => {
    return conquistas.length > 0 ? (
      <ul>
        {conquistas.map((conquista, index) => (
          <li key={index} className={isConquistaConcluida(conquista) ? "conquista-concluida" : ""}>
            {/* Mapeando a conquista para a imagem correspondente */}
            <img className='imgConquista' src={getImagemConquista(conquista.nome_conquista)} alt="" />
            <strong>{conquista.nome_conquista}</strong> {conquista.descricao}
          </li>
        ))}
      </ul>
    ) : (
      <p>Nenhuma conquista disponível.</p>
    );
  };

  // Função para obter a imagem correta com base no nome da conquista
  const getImagemConquista = (nomeConquista: string): string => {
    switch (nomeConquista) {
      case 'Primeiro conteúdo concluído':
        return imgConquista1;
      case '5 conteúdos concluídos':
        return imgConquista2;
      case '10 conteúdos concluídos':
        return imgConquista3;
      case 'Estudo Backend':
        return imgConquista4;
      case 'Estudo Frontend':
        return imgConquista5;
      case 'Estudo Database':
        return imgConquista6;
      case 'Estudo Devops':
        return imgConquista7;
      case 'Estudo Mobile':
        return imgConquista8;
      case 'Estudo UX e Design':
        return imgConquista9;

      default:
        return ''; 
    }
  };
  useEffect(() => {
    if(user !== null){
      const fetchData = async () => {
        try {
          // Fetch conquistas do usuário
          const responseUsuario = await fetch(`${import.meta.env.REACT_APP_API_URL}/conquistas-usuario/${user?.id}`);
          const dataUsuario = await responseUsuario.json();
  
          if (responseUsuario.ok) {
            setConquistasUsuario(dataUsuario.conquistasUsuario);
          } else {
            console.error('Erro na requisição de conquistas do usuário:', dataUsuario.message);
          }
  
          // Fetch todas as conquistas
          const responseTodas = await fetch(`${import.meta.env.REACT_APP_API_URL}/conquistas`);
          const dataTodas = await responseTodas.json();
  
          if (responseTodas.ok) {
            setTodasConquistas(dataTodas.conquistas);
          } else {
            console.error('Erro na requisição de todas as conquistas:', dataTodas.message);
          }
        } catch (error) {
          console.error('Erro:', error);
        }
      };
      fetchData();
    }
    
  }, [user]);

  return (
    <div className='container-conquistas'>
      <Outlet />
      <h2>Conquistas</h2>

      <div className='legenda-conquistas'>
        <div className="legenda">
          <p>Legenda:</p>
          <div className="conquista-legenda">
            <div className="quadrado-conquista conquista-concluida"></div>
            <strong>Conquista Concluída</strong>
          </div>
          <div className="conquista-legenda">
            <div className="quadrado-conquista"></div>
            <strong>Conquista Pendente</strong>
          </div>
        </div>

        {renderizarConquistas(todasConquistas, isConquistaConcluida)}
      </div>
    </div>
  );
};

export default Conquistas;
