import React, { useEffect } from 'react';
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
import imgConquista10 from '../../assets/10.png'
import medalha from '../../assets/medalha.png'

import { FaStar } from 'react-icons/fa';
import { useConquistasStore } from '../../store/useConquistasStore';

const Conquistas: React.FC = () => {
  const { user } = useAuth();
  const { conquistasUsuario, todasConquistas, fetchConquistasUsuario, fetchTodasConquistas } = useConquistasStore();

  const isConquistaConcluida = (conquista: { nome_conquista: string }) =>
    conquistasUsuario.some((c) => c.nome_conquista === conquista.nome_conquista);

  const renderizarConquistas = (
    conquistas: Array<{ id: number, nome_conquista: string, descricao: string }>,
    isConquistaConcluida: (conquista: { nome_conquista: string }) => boolean
  ) => {
    const conquistasOrdenadasPorId = [...conquistas].sort((a, b) => a.id - b.id);
    const primeirasQuatroConquistas = conquistasOrdenadasPorId.slice(0, 4);
    const conquistasRestantes = conquistasOrdenadasPorId.slice(4).sort((a, b) =>
      a.nome_conquista.localeCompare(b.nome_conquista)
    );

    return (
      <ul>
        {primeirasQuatroConquistas.map((conquista) => (
          <li
            key={conquista.id}
            className={`conquista-item ${isConquistaConcluida(conquista) ? "conquista-concluida" : ""}`}
            title={conquista.descricao}
          >
            <img className='imgConquista' src={getImagemConquista(conquista.nome_conquista)} alt={conquista.nome_conquista} />
            <strong>{conquista.nome_conquista}</strong>
          </li>
        ))}
        {conquistasRestantes.map((conquista) => (
          <li
            key={conquista.id}
            className={`conquista-item ${isConquistaConcluida(conquista) ? "conquista-concluida" : ""}`}
            title={conquista.descricao}
          >
            <img className='imgConquista' src={getImagemConquista(conquista.nome_conquista)} alt={conquista.nome_conquista} />
            <strong>{conquista.nome_conquista}</strong>
          </li>
        ))}
      </ul>
    );
  };

  const getImagemConquista = (nomeConquista: string): string => {
    switch (nomeConquista) {
      case 'Primeiro conteúdo concluído':
        return imgConquista1;
      case '5 conteúdos concluídos':
        return imgConquista2;
      case '10 conteúdos concluídos':
        return imgConquista3;
      case 'Estudo Algoritmos':
        return imgConquista10;
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
      case 'Medalha':
        return medalha;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (user !== null) {
      fetchConquistasUsuario(Number(user.id));
      fetchTodasConquistas();
    }
  }, [user, fetchConquistasUsuario, fetchTodasConquistas]);

  return (
    <div className='container-conquistas'>
      <Outlet />
      <h2 className='text-conquistas'>Conquistas</h2>
      <div className='legenda-conquistas'>
        <div className="legenda">
          <p>Legenda</p>
          <div className="conquista-legenda">
            <div className="quadrado-conquista conquista-concluida"></div>
            <strong>Conquista Concluída</strong>
          </div>
          <div className="conquista-legenda">
            <div className="quadrado-conquista"></div>
            <strong>Conquista Pendente</strong>
          </div>
          <div className="star-container" title="Dias seguidos de estudos">
            <div className="conquista-legenda">
              <FaStar className="star-icon-conquistas" />
              <strong className='text-star-conquista'>Dias seguidos logado</strong>
            </div>
          </div>
        </div>
        {renderizarConquistas(todasConquistas, isConquistaConcluida)}
      </div>
    </div>
  );
};

export default Conquistas;