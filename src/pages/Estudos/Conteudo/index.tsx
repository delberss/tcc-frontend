// Conteudo.tsx
import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import { FaCheck } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { FaQuestionCircle } from 'react-icons/fa';
import { } from 'react-icons/fa';
import { getButtonStyleByType, getButtonStyle } from '../../../../color-estudos';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaLock } from 'react-icons/fa';

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


  const [novoConteudoNome, setNovoConteudoNome] = useState<string>('');
  const [novoConteudoDescricao, setNovoConteudoDescricao] = useState<string>('');
  const [novoConteudoPontos, setNovoConteudoPontos] = useState<number>(0);
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
  }, [conteudos]);

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
          materiais: materiaisJSON
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
            <div className='quantidades no-cursor'>
                <span>{quantidadeAcertos?.[conteudo.id] || 0}</span>
                <span>/</span>
                <span>{quantidadePerguntas?.[conteudo.id] || 0}</span>
            </div>
        ) : (
          <FaLock />
        );
    }
}




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
            placeholder="Digite o nome do novo conteúdo"
            value={novoConteudoNome}
            onChange={(e) => setNovoConteudoNome(e.target.value)}
          />
          <textarea
            placeholder="Digite a descrição do conteúdo"
            value={novoConteudoDescricao}
            onChange={(e) => setNovoConteudoDescricao(e.target.value)}
            style={{ width: '95%', padding: '10px', marginBottom: '10px', resize: 'none' }}
          />
          <input
            type="number"
            placeholder="Pontos"
            value={novoConteudoPontos}
            onChange={(e) => setNovoConteudoPontos(parseInt(e.target.value))}
          />

          <input
            type="text"
            placeholder="Materiais"
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
              onClick={!conclusoes[conteudo.id] || user?.tipo_usuario === 'admin' ? () => abrirQuestionario(conteudo.id, conteudo.titulo) : undefined}
              key={index}
              style={getButtonStyle(tipo)}
              className={`item-${index} conteudo-item ${conclusoes[conteudo.id] && user?.tipo_usuario !== 'admin' ?
                'concluido' : ''} ${conclusoes[conteudo.id - 1] || index == 0 ||
                  user?.tipo_usuario === 'admin' ? 'cursor-pointer' : 'non-clickable'}`}
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
          <a className='estudoRoadMap' href={estudo.link} target='_blank'>
            Roadmap: {estudo.link}
          </a>
        </div>
      )}


    </div>
  ) : <></>;

};

export default Conteudo;



