import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import { FaCheck } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { FaQuestionCircle } from 'react-icons/fa';
import { } from 'react-icons/fa';
import { getButtonStyleByType, getButtonStyle } from '../../../../color-estudos';
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaLock } from 'react-icons/fa';
import { IoRocket } from "react-icons/io5";

interface RocketLinkProps {
  href: string;
}

interface Conteudo {
  id: number;
  titulo: string;
  descricao: string;
}


const Conteudo: React.FC = () => {

  const { tipo = 'default' } = useParams<{ tipo?: string }>();
  const [conteudos, setConteudos] = useState<any[]>([]);
  const [conteudoSelecionado, setConteudoSelecionado] = useState<number | null>(null);
  const [conclusoes, setConclusoes] = useState<Record<number, boolean>>({});
  const [mostrarAssuntos, setMostrarAssuntos] = useState(true);
  const [quantidadeAcertos, setQuantidadeAcertos] = useState<Record<number, number>>({});
  const [quantidadePerguntas, setQuantidadePerguntas] = useState<Record<number, number>>({});
  const [conteudosConcluidos, setConteudosConcluidos] = useState<number[]>([]);
  const [novoConteudoNome, setNovoConteudoNome] = useState<string>('');
  const [novoConteudoDescricao, setNovoConteudoDescricao] = useState<string>('');
  const [novoConteudoPontos, setNovoConteudoPontos] = useState<number | null>(null);
  const [linkVideo, setLinkVideo] = useState<string>('');
  const [novoConteudoMateriais, setNovoConteudoMateriais] = useState<string>('');
  const [mostrarCampoConteudo, setMostrarCampoConteudo] = useState<boolean>(false);

  const [estudoId, setEstudoId] = useState<number>(0);
  const [estudo, setEstudo] = useState<any>({});

  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchConclusoes = async () => {

      try {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/conteudos-concluidos/${user?.id}`);
        const data = await response.json();

        if (data.success) {
          setConteudosConcluidos(data.conteudos_completos);
          console.log(data.conteudos_completos)
        }
      } catch (error) {
        console.error('Erro ao buscar conclusões:', error);
      }
    };

    fetchConclusoes();
  }, [conclusoes, conteudos, token]);


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
        const idResponse = await fetchData(`${import.meta.env.REACT_APP_API_URL}/id/${tipo}`);
        setEstudoId(idResponse)
        const estudosResponse = await fetchData(`${import.meta.env.REACT_APP_API_URL}/conteudos/${idResponse}`);

        setConteudos(estudosResponse);
      } catch (error) {
        console.error(`Erro ao buscar conteúdos do ${tipo}:`, error);
      }
    };

    fetchConteudos();
  }, [tipo]);

  useEffect(() => {
    const fetchEstudo = async () => {
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/estudos/${tipo}`);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const data = await response.json();
        setEstudo(data[0]);
      } catch (error) {
        console.error(`Erro ao buscar estudo ${tipo}:`, error);
      }
    };
    fetchEstudo();
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
  }, [conteudos, mostrarAssuntos]);

  const contudoConcluido = async (conteudoId: number) => {
    try {
      const idResponse = await fetchData(`${import.meta.env.REACT_APP_API_URL}/verificar-conclusao/${user?.id}/${conteudoId}`);
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
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/quantidade-acertos/${conteudoId}`, {
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

          if (!conclusao) {
            await fetchQuantidades(conteudo.id);
          }
        } catch (error) {
          console.error(`Erro ao buscar conclusão e quantidades do conteúdo ${conteudo.id}:`, error);
          novasConclusoes[conteudo.id] = false;
        }
      }

      setConclusoes(novasConclusoes);
    };

    fetchConclusoes();
  }, [conteudos, token]);

  const abrirQuestionario = (conteudoId: number, conteudoConcluido: boolean, titulo: string, descricao: string, pontos: number, tempomaximo: number) => {
    setConteudoSelecionado(conteudoId);
    navigate(`/estudos/${tipo}/${conteudoId}`, {
      state: {
        conteudoId: conteudoId,
        conteudoConcluido: conteudoConcluido,
        titulo: titulo,
        descricao: descricao,
        pontos: pontos,
        tempomaximo: tempomaximo,
      }
    });
  };

  const handleNovoConteudo = () => {
    setMostrarCampoConteudo(!mostrarCampoConteudo);
  };

  const handleSalvarNovoConteudo = async () => {
    try {
      if (!novoConteudoNome || !novoConteudoDescricao || !novoConteudoPontos || !novoConteudoMateriais) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      const materiaisArray = novoConteudoMateriais.split(",").map(material => material.trim().replace(/^'|'$/g, ''));
      const materiaisJSON = JSON.stringify(materiaisArray);

      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/adicionarConteudo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: novoConteudoNome,
          descricao: novoConteudoDescricao,
          estudo_id: estudoId,
          pontos: novoConteudoPontos,
          materiais: materiaisJSON,
          linkVideo: linkVideo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao adicionar novo conteúdo.");
      }

      setNovoConteudoNome('');
      setNovoConteudoDescricao('');
      setNovoConteudoPontos(0);
      setNovoConteudoMateriais('');
      setLinkVideo('');


      setConteudos([...conteudos, data]);

      alert("Novo conteúdo adicionado com sucesso!");
      setMostrarCampoConteudo(!mostrarCampoConteudo)
    } catch (error) {
      console.error("Erro ao adicionar novo conteúdo:", error);
      alert("Erro ao adicionar novo conteúdo. Por favor, tente novamente mais tarde.");
    }
  };

  const renderizaPerguntasAcertos = (conteudo: Conteudo, index: number) => {
    const liElement = document.querySelector(`.item-${index}`);

    if (liElement) {
      const isNonClickable = liElement.classList.contains('non-clickable');

      return !isNonClickable ? (
        <div className='quantidades' title='Respostas corretas/Perguntas - Última tentativa'>
          <span>{quantidadeAcertos?.[conteudo.id] || 0}</span>
          <span>/</span>
          <span>{quantidadePerguntas?.[conteudo.id] || 0}</span>
        </div>
      ) : (
        <FaLock />
      );
    }
  }




  const RocketLink: React.FC<RocketLinkProps> = ({ href }) => {
    const handleClick = () => {
      window.open(href, '_blank');
    };

    return (
      <IoRocket className='rocket-link' onClick={handleClick} />
    );
  };

  const conteudoDesbloqueado = (idConteudo: number, index?: number) => {
    const indexConteudo = conteudos.findIndex(conteudo => conteudo.id === idConteudo);

    let idConteudoAnterior = conteudos[indexConteudo - 1]?.id;

    if (index === 0) {
      return true; // Primeiro conteúdo sempre está desbloqueado
    }

    if (conteudosConcluidos.includes(idConteudoAnterior)) {
      return true;
    }

    let qtdPerguntas = quantidadePerguntas?.[idConteudo - 1];
    let qtdAcertos = quantidadeAcertos?.[idConteudo - 1];

    if (qtdAcertos === undefined || qtdAcertos === 0 || qtdPerguntas === undefined) {
      return false; // Se não houver informações suficientes sobre o desempenho do usuário, bloqueia o conteúdo
    }

    return qtdAcertos >= (qtdPerguntas * 0.60);
  }

  const handleChangeInputPontos = (e: any) => {
    const value = e.target.value;
    const numberValue = value === '' ? null : parseInt(value);

    if (numberValue === null || numberValue >= 0) {
      setNovoConteudoPontos(numberValue);
    }
  };

  return user ? (
    <div className={`container-estudos-generico`}>
      <span className='tipoEstudo' >{tipo.toUpperCase()}</span>
      <button className='sobreOEstudo' onClick={() => setMostrarAssuntos(!mostrarAssuntos)} title="O que é?">
        <FaQuestionCircle className="custom-icon" />
      </button>
      <div>
        {user?.tipo_usuario === 'admin' && (
          <>
            <span>Adicionar novo conteúdo</span>
            <button className="button-adicionar-conteudo" onClick={handleNovoConteudo}>
              <AiOutlinePlus className="icon" />
            </button>
          </>

        )}
      </div>
      {mostrarCampoConteudo && (
        <div className="novo-conteudo-container">
          <input
            type="text"
            placeholder="Nome do novo conteúdo"
            value={novoConteudoNome}
            onChange={(e) => setNovoConteudoNome(e.target.value)}
          />
          <textarea
            placeholder="Descrição do conteúdo"
            value={novoConteudoDescricao}
            onChange={(e) => setNovoConteudoDescricao(e.target.value)}
            style={{ width: '95%', padding: '10px', marginBottom: '10px', resize: 'none' }}
          />

          <input
            type="text"
            placeholder="Link do vídeo para questionário (Opcional)"
            value={linkVideo}
            onChange={(e) => setLinkVideo(e.target.value)}
          />

          <input
            title='Pontos'
            type="number"
            placeholder="Pontos"
            value={novoConteudoPontos === null ? '' : novoConteudoPontos}
            onChange={handleChangeInputPontos}
            min="0" // Também adiciona o atributo min para evitar valores negativos
          />

          <input
            type="text"
            placeholder="Materiais. Ex: www.exemplo.com, www.exemplo2.com"
            value={novoConteudoMateriais}
            onChange={(e) => setNovoConteudoMateriais(e.target.value)}
          />

          <button onClick={handleSalvarNovoConteudo}>Salvar</button>
        </div>
      )}

      {mostrarAssuntos ? (
        <ul className='conteudos-list'>
          {conteudos.map((conteudo, index) => (
            <li
              onClick={index === 0 || conteudoDesbloqueado(conteudo.id, index) || user?.tipo_usuario === 'admin' ? () => abrirQuestionario(conteudo.id, conteudosConcluidos.includes(conteudo.id), conteudo.titulo, conteudo.descricao, conteudo.pontos, conteudo.tempomaximo) : undefined}
              key={index}
              style={getButtonStyle(tipo)}
              className={`item-${index} conteudo-item ${conteudosConcluidos.includes(conteudo.id) && user?.tipo_usuario !== 'admin' ? 'concluido' : ''} ${conteudoDesbloqueado(conteudo.id) || index === 0 || user?.tipo_usuario === 'admin' ? 'cursor-pointer' : 'non-clickable'}`}
              title={conteudoDesbloqueado(conteudo.id) || index === 0 || user?.tipo_usuario === 'admin' ? '' : 'Conteúdo bloqueado. Acerte pelo menos 60% do conteúdo anterior.'}
            >
              {conteudosConcluidos.includes(conteudo.id) && (
                <FaCheck className="conteudo-concluido-indicator" title='Conteúdo já concluído'/>
              )}
              <div className='conteudo-detalhes'>
                <div className='conteudo-info'>
                  <div className='espaco-titulo'>
                    <strong className='titulo-conteudo'>{conteudo.titulo}</strong>
                  </div>
                  <div>
                    {conteudo.descricao}
                  </div>

                  {conclusoes[conteudo.id] ? (
                    <div className={`icone-conclusao`}>
                      <span title='Você acertou 100% do conteúdo'>100%</span>
                    </div>
                  ) : (
                    renderizaPerguntasAcertos(conteudo, index)
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className='infosEstudo'>
          <p className='estudoDescription'>{estudo.descricao}</p>
          <RocketLink href={estudo.link} />
          <a className='estudoRoadMap' href={estudo.link} target='_blank'>
            Roadmap
          </a>
        </div>
      )}


    </div>
  ) : <></>;

};

export default Conteudo;



