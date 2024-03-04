// Conteudo.tsx
import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import { FaCheck } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { getButtonStyleByType, getButtonStyle } from '../../../../color-estudos';


const estudos = {
  BACKEND: {
    description: "O Backend é a parte da aplicação que lida com a lógica e a manipulação dos dados. Responsável pelo processamento do lado do servidor, gerencia as operações que ocorrem nos bastidores da aplicação.",
    link: "https://roadmap.sh/backend"
  },

  FRONTEND: {
    description: "O Frontend é a interface visível para os usuários. Trata da apresentação e interação direta com o usuário em um aplicativo ou site. Envolve tecnologias como HTML, CSS e JavaScript para criar uma experiência visual atraente e intuitiva.",
    link: "https://roadmap.sh/frontend"
  },

  DATABASE: {
    description: "Database (Banco de Dados) refere-se à organização e armazenamento de dados de forma eficiente. Envolve a criação, consulta e manipulação de bancos de dados para garantir o acesso rápido e seguro às informações.",
    link: "https://roadmap.sh/postgresql-dba"
  },

  "DEVOPS E AUTOMAÇÃO DE INFRAESTRUTURA": {
    description: "DevOps é uma cultura e conjunto de práticas que integram o desenvolvimento de software com as operações de TI. Visa melhorar a colaboração e eficiência, automatizando processos de construção, teste e implantação.",
    link: "https://roadmap.sh/devops"
  },

  MOBILE: {
    description: "Desenvolvimento Mobile concentra-se na criação de aplicativos para dispositivos móveis, como smartphones e tablets. Utiliza frameworks como React Native ou Flutter para garantir uma experiência consistente em diversas plataformas.",
    link: "https://roadmap.sh/android"
  },

  "UX e Design": {
    description: "UX (User Experience) e Design estão relacionados à criação de interfaces centradas no usuário. Envolve o design de interações e a experiência do usuário, garantindo que os produtos digitais sejam intuitivos, acessíveis e visualmente atraentes.",
    link: "https://roadmap.sh/ux-design"
  }
};


const Conteudo: React.FC = () => {
  const { tipo = 'default' } = useParams<{ tipo?: string }>();
  const [conteudos, setConteudos] = useState<any[]>([]);
  const [conteudoSelecionado, setConteudoSelecionado] = useState<number | null>(null);
  const [conclusoes, setConclusoes] = useState<Record<number, boolean>>({});
  const [mostrarAssuntos, setMostrarAssuntos] = useState(true);
  const [quantidadeAcertos, setQuantidadeAcertos] = useState<Record<number, number>>({});
  const [quantidadePerguntas, setQuantidadePerguntas] = useState<Record<number, number>>({});

  const tipoUppercase = tipo.toUpperCase() as keyof typeof estudos;

  const estudo = estudos[tipoUppercase];


  const navigate = useNavigate();
  const { user, token } = useAuth();


  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro ao buscar conteúdos do ${tipo}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchConteudos = async () => {
      try {
        const idResponse = await fetchData(`http://localhost:4000/id/${tipo}`);
        const estudosResponse = await fetchData(`http://localhost:4000/conteudos/${idResponse}`);

        setConteudos(estudosResponse);
      } catch (error) {
        console.error(`Erro ao buscar conteúdos do ${tipo}:`, error);
      }
    };

    fetchConteudos();
  }, [tipo]);

  useEffect(() => {
    const fetchConclusoes = async () => {
      const novasConclusoes: Record<number, boolean> = {};

      for (const conteudo of conteudos) {
        try {
          const conclusao = await contudoConcluido(conteudo.id);
          novasConclusoes[conteudo.id] = conclusao;
        } catch (error) {
          console.error(`Erro ao buscar conclusão do conteúdo ${conteudo.id}:`, error);
          novasConclusoes[conteudo.id] = false; // ou lidar com o erro de outra forma
        }
      }

      setConclusoes(novasConclusoes);
    };

    fetchConclusoes();
  }, [conteudos]);

  const contudoConcluido = async (conteudoId: number) => {
    try {
      const idResponse = await fetchData(`http://localhost:4000/verificar-conclusao/${user?.id}/${conteudoId}`);
      const conclusao = idResponse.conclusao;
      return conclusao;
    } catch (error) {
      console.error(`Erro ao verificar conclusão do conteúdo ${conteudoId}:`, error);
      return false; // ou lança uma exceção, dependendo do comportamento desejado
    }
  };


  useEffect(() => {
    const fetchQuantidades = async (conteudoId: number) => {
      try {
        const response = await fetch(`http://localhost:4000/quantidade-acertos/${conteudoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        setQuantidadeAcertos((prev) => ({ ...prev, [conteudoId]: data.quantidade_acertos }));
        setQuantidadePerguntas((prev) => ({ ...prev, [conteudoId]: data.quantidade_total_perguntas }));
      } catch (error) {
        console.error(`Erro ao buscar quantidades para o conteúdo ${conteudoId}:`, error);
      }
    };

    const fetchConclusoes = async () => {
      const novasConclusoes: Record<number, boolean> = {};

      for (const conteudo of conteudos) {
        try {
          const conclusao = await contudoConcluido(conteudo.id);
          novasConclusoes[conteudo.id] = conclusao;

          // Se o conteúdo não foi concluído, busca as quantidades
          if (!conclusao) {
            await fetchQuantidades(conteudo.id);
          }
        } catch (error) {
          console.error(`Erro ao buscar conclusão e quantidades do conteúdo ${conteudo.id}:`, error);
          novasConclusoes[conteudo.id] = false; // ou lidar com o erro de outra forma
        }
      }

      setConclusoes(novasConclusoes);
    };

    fetchConclusoes();
  }, [conteudos, token]);

  const abrirQuestionario = (conteudoId: number, titulo: string) => {
    setConteudoSelecionado(conteudoId);
    navigate(`/estudos/${tipo}/${conteudoId}`, {
      state: {
        conteudoId: conteudoId,
        titulo: titulo,
      }
    });
  };


  return (
    <div className={`container-estudos-generico`}>
      <button className='tipoEstudo' onClick={() => setMostrarAssuntos(!mostrarAssuntos)}>
        {tipo.toUpperCase()}
      </button>


      {mostrarAssuntos ? (
        <ul className='conteudos-list'>
          {conteudos.map((conteudo, index) => (
            <li
              onClick={!conclusoes[conteudo.id] ? () => abrirQuestionario(conteudo.id, conteudo.titulo) : undefined}
              key={index}
              style={getButtonStyle(tipo)}
              className={`conteudo-item ${conclusoes[conteudo.id] ? 'concluido' : ''} ${!conclusoes[conteudo.id] ? 'cursor-pointer' : 'non-clickable'
                }`}
            >
              <div className='conteudo-detalhes'>
                <div className='conteudo-info'>
                  <div>
                    <strong className='titulo-conteudo'>{conteudo.titulo}</strong>
                  </div>
                  <div>
                    {conteudo.descricao}
                  </div>

                  {conclusoes[conteudo.id] ? (
                    <div className={`icone-conclusao no-cursor`}>
                      <FaCheck />
                    </div>
                  ) : (
                    <div className='quantidades no-cursor'>
                      <span>{quantidadeAcertos?.[conteudo.id] || 0}</span>
                      <span>/</span>
                      <span>{quantidadePerguntas?.[conteudo.id] || 0}</span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className='infosEstudo'>
          <p className='estudoDescription'>{estudo.description}</p>
          <a className='estudoRoadMap' href={estudo.link} target='_blank'>
            Roadmap: {estudo.link}
          </a>
        </div>
      )}


    </div>
  );

};

export default Conteudo;



