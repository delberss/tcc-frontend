import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../../../AuthContext';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { IoBookOutline } from "react-icons/io5";
import { MdFeedback } from "react-icons/md";
import { FiArrowLeft } from 'react-icons/fi';
import YouTubePlayer from '../../../../components/YouTubePlayer';
import ModalConfirmacao from '../../../../components/ModalConfirmacao';
import { FaQuestionCircle, FaTrash } from 'react-icons/fa';
import ModalEditarPergunta from '../../../../components/ModalPerguntas';
import ModalFinalizacaoQuestionario from '../../../../components/ModalFinalizacaoQuestionario';
import { converterParaSegundos } from '../../../../funcoes/converterParaSegundos';


interface Pergunta {
  id: number;
  pergunta: string;
  opcao_a: string;
  opcao_b: string;
  opcao_c: string;
  opcao_d: string;
  resposta_correta: string;
  minutagempergunta: number;
}

interface PerguntaErrada {
  id: number;
  pergunta: string;
}




const Questionario: React.FC = () => {
  const { token, user } = useAuth();
  const videoRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  let conteudoId = location.state.conteudoId;
  let titulo = location.state.titulo;
  let descricao = location.state.descricao;
  let pontos = location.state.pontos;

  const [respostasEnviadas, setRespostasEnviadas] = useState(false);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [materiais, setMateriais] = useState<string[]>([]);
  const [videoConteudo, setVideoConteudo] = useState<string>("");
  const [linkVideo, setLinkVideo] = useState<string>('');
  const [linksMateriais, setLinksMateriais] = useState<string>('');

  const [editarLinkVideo, setEditarLinkVideo] = useState<boolean>(false);
  const [adicionarMateriais, setAdicionarMateriais] = useState<boolean>(false);

  const [mostrarDescricaoConteudo, setMostrarDescricaoConteudo] = useState(false);




  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(videoConteudo ? 30 : 90);
  const [questionarioAtivado, setQuestionarioAtivado] = useState(false);

  const [editingPerguntaId, setEditingPerguntaId] = useState<number | null>(null);
  const [novaMinutagem, setNovaMinutagem] = useState('');
  const [perguntaId, setPerguntaId] = useState<number | null>(null);

  const [perguntaSelecionada, setPerguntaSelecionada] = useState<Pergunta>({
    id: 0,
    pergunta: '',
    opcao_a: '',
    opcao_b: '',
    opcao_c: '',
    opcao_d: '',
    resposta_correta: '',
    minutagempergunta: 0
  });




  const [mostrarCampoQuestionario, setMostrarCampoQuestionario] = useState<boolean>(false);
  const [mostrarCampoEditarPerguntas, setMostrarCampoEditarPerguntas] = useState<boolean>(false);

  const [novaPergunta, setNovaPergunta] = useState<string>('');
  const [letraA, setLetraA] = useState<string>('');
  const [letraB, setLetraB] = useState<string>('');
  const [letraC, setLetraC] = useState<string>('');
  const [letraD, setLetraD] = useState<string>('');
  const [minutagemPergunta, setMinutagemPergunta] = useState<string>('');
  const [respostaCorreta, setRespostaCorreta] = useState<string>('');
  const [perguntasErradas, setPerguntasErradas] = useState<PerguntaErrada[]>([]);
  const [conjuntoMinutagemPergunta, setConjuntoMinutagemPergunta] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tempoCongelado, setTempoCongelado] = useState(false);
  const [qtdAcertos, setQtdAcertos] = useState(0);
  const [videoPausado, setVideoPausado] = useState(false);
  const [momentoVideo, setMomentoVideo] = useState(0);

  const [showModalComponente, setShowModalComponente] = useState(false);
  const [showModalComponentePergunta, setShowModalComponentePergunta] = useState(false);


  const ativarQuestionario = () => {
    setShowModalComponente(true);
  };

  const handleEditarLinkVideo = () => {
    setEditarLinkVideo(!editarLinkVideo);
  };

  const handleAdicionarMateriais = () => {
    setAdicionarMateriais(!adicionarMateriais);
  };

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  useEffect(() => {

    const fetchPerguntas = async () => {
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/perguntas/${conteudoId}`);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        data.sort((a: Pergunta, b: Pergunta) => a.minutagempergunta - b.minutagempergunta);
        setPerguntas(data);

        const minutagemPerguntaArray = data.map((pergunta: Pergunta) => pergunta.minutagempergunta);
        setConjuntoMinutagemPergunta(minutagemPerguntaArray);
      } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
      }
    };

    fetchMateriais()
    fetchPerguntas();

  }, [conteudoId]);


  const fetchMateriais = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/materiais/${conteudoId}`);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.hasOwnProperty('materiais') && data.hasOwnProperty('videoconteudo')) {
        setMateriais(data.materiais);
        setVideoConteudo(data.videoconteudo);
      } else {
        console.error('Dados incompletos recebidos da API');
      }
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
    }
  };

  useEffect(() => {
    const fetchPerguntasErradas = async () => {
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/perguntas-erradas/${user?.id}/${conteudoId}`);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        setPerguntasErradas(data.perguntas_erradas);
      } catch (error) {
        console.error('Erro ao buscar perguntas erradas:', error);
      }
    };

    fetchPerguntasErradas();
  }, [conteudoId]);


  useEffect(() => {
    if (!tempoCongelado && questionarioAtivado && videoPausado || !videoConteudo) {
      let startTime = Date.now();

      const updateTimer = () => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const remainingTime = Math.max(videoConteudo ? 30 - elapsedTime : 90 - elapsedTime, 0);

        setTempoRestante(remainingTime);
      };

      const intervalId = setInterval(updateTimer, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [tempoCongelado, questionarioAtivado, videoPausado]);


  useEffect(() => {
    if (questionarioAtivado && !respostasEnviadas && tempoRestante === 0) {
      if (!respostas[perguntas[perguntaAtual].id]) {
        setRespostas((prevRespostas) => ({
          ...prevRespostas,
          [perguntas[perguntaAtual].id]: '',
        }));
      }

      if (perguntaAtual < perguntas.length - 1) {
        setPerguntaAtual((prevPergunta) => prevPergunta + 1);
        if (videoConteudo) {
          setTempoRestante(30);
        } else {
          setTempoRestante(90);
        }
        setVideoPausado(false);
      }
    }
  }, [tempoRestante, respostas, perguntas, perguntaAtual]);

  // SÓ VAI CHAMAR A API DE RESPOSTAS DEPOIS QUE TODAS PERGUNTAS TIVEREM UMA RESPOSTA (MESMO QUE VAZIO)
  useEffect(() => {
    const todasRespondidas = perguntas.every(pergunta => respostas[pergunta.id] !== undefined);

    if (questionarioAtivado && tempoRestante === 0 && !respostasEnviadas && todasRespondidas) {
      enviarRespostas();
    }
  }, [respostas, tempoRestante, respostasEnviadas, perguntas]);



  const handleRespostaChange = (respostaSelecionada: string) => {
    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      [perguntas[perguntaAtual].id]: respostaSelecionada,
    }));
  };

  const handleAvancar = () => {
    if (videoConteudo) {
      setTempoRestante(30);
    } else {
      setTempoRestante(90);
    }

    if (!respostas[perguntas[perguntaAtual].id]) {
      alert('Por favor, selecione uma resposta antes de avançar.');
      return;
    }

    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual((prevPergunta) => prevPergunta + 1);
      setVideoPausado(false);
    } else {
      enviarRespostas();
    }
  };

  const enviarRespostas = async () => {
    if (Object.keys(respostas).length >= 0) {
      try {
        setTempoCongelado(true);
        setRespostasEnviadas(true);
        const respostasArray = Object.entries(respostas).map(([pergunta_id, resposta_do_usuario]) => ({
          pergunta_id: parseInt(pergunta_id, 10),
          resposta_do_usuario,
        }));

        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/respostas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ respostas: respostasArray }),
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        const data = await response.json();
        setQtdAcertos(data.respostasCorretas)
        setShowModal(true);
      } catch (error) {
        console.error('Erro ao enviar respostas:', error);
      }
    }
  };

  const handleNovoQuestionario = () => {
    setMostrarCampoQuestionario(!mostrarCampoQuestionario);
  };

  const handleEditarPerguntas = (pergunta: Pergunta) => {
    setPerguntaSelecionada(pergunta);
    setMostrarCampoEditarPerguntas(true);
  }


  const handleSalvarNovoQuestionario = async () => {
    if (
      novaPergunta.trim() === '' || letraA.trim() === '' || letraB.trim() === '' || letraC.trim() === '' || letraD.trim() === '' || respostaCorreta.trim() === ''
    ) {
      alert('Por favor, preencha todos os campos antes de salvar.');
      return;
    }

    const respostaCorretaUpperCase = respostaCorreta.toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(respostaCorretaUpperCase)) {
      alert('A resposta correta deve ser uma das letras A, B, C ou D.');
      return;
    }

    try {
      const minutagem = converterParaSegundos(String(minutagemPergunta));

      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/add/pergunta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conteudo_id: conteudoId,
          pergunta: novaPergunta,
          opcao_a: letraA,
          opcao_b: letraB,
          opcao_c: letraC,
          opcao_d: letraD,
          minutagemPergunta: minutagem,
          resposta_correta: respostaCorreta.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMostrarCampoQuestionario(!mostrarCampoQuestionario);
        window.location.reload();
      } else {
        console.error('Erro ao adicionar pergunta:', data.message);
      }
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
    }
  };



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNovaMinutagem(event.target.value);
  };

  const handleSalvarNovaMinutagem = async () => {
    if (perguntaId === null || novaMinutagem.trim() === '') {
      alert('Por favor, selecione uma pergunta e insira a nova minutagem.');
      return;
    }

    const novaMinutagemSegundos = converterParaSegundos(novaMinutagem);

    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/edit/pergunta/${perguntaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          minutagemPergunta: novaMinutagemSegundos,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPerguntas((perguntas) => {
          return perguntas.map((pergunta) => {
            if (pergunta.id === perguntaId) {
              return { ...pergunta, minutagempergunta: novaMinutagemSegundos };
            }
            return pergunta;
          });
        });

        setPerguntas((perguntas) => {
          return perguntas.slice().sort((a, b) => a.id - b.id);
        });

        setEditingPerguntaId(null);
      } else {
        console.error('Erro ao editar minutagem da pergunta:', data.message);
      }
    } catch (error) {
      console.error('Erro ao editar minutagem da pergunta:', error);
    }
  };

  const handleSalvarEditLinkVideo = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/conteudos/${conteudoId}/video`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          videoConteudo: linkVideo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Link do vídeo atualizado com sucesso:');
        setEditarLinkVideo(false);
        window.location.reload();

      } else {
        console.error('Erro ao atualizar link do vídeo:', data.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar link do vídeo:', error);
    }
  };

  const handleAdicionaisMateriais = async () => {
    const materiaisArray = linksMateriais.split(",").map(material => material.trim().replace(/^'|'$/g, ''));
      const materiaisJSON = JSON.stringify(materiaisArray);
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/conteudos/${conteudoId}/materiais`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          materiais: materiaisJSON,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Materiais atualizados com sucesso:');
        setEditarLinkVideo(false);
        window.location.reload();

      } else {
        console.error('Erro ao atualizar link do vídeo:', data.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar link do vídeo:', error);
    }
  };

  const ativarModal = () => {
    setShowModalComponentePergunta(true);
  };

  const handleDeletePergunta = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/pergunta/${perguntaSelecionada.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setShowModalComponentePergunta(false);
      } else {
        console.error('Erro ao excluir pergunta:', data.message);
      }
    } catch (error) {
      console.error('Erro ao excluir pergunta:', error);
    }
  };

  const renderizarPerguntas = () => {
    return (
      <>
        <h3>Editar perguntas</h3>
        {perguntas.map((pergunta, index) => (
          <div key={pergunta.id} className="pergunta-item">
            {editingPerguntaId === pergunta.id ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={novaMinutagem}
                  onChange={handleInputChange}
                  className="edit-input"
                  placeholder={`Tempo para pergunta: ${pergunta.pergunta}`}
                />
                <button onClick={handleSalvarNovaMinutagem} className="edit-button">Salvar</button>
              </div>
            ) : (
              <div className="pergunta-content">
                <span className="pergunta-text">{index + 1}. {pergunta.pergunta}</span>
                <AiOutlineEdit onClick={() => handleEditarPerguntas(pergunta)} className="edit-icon" />
                <FaTrash onClick={() => { ativarModal(); setPerguntaSelecionada(pergunta); }} className="edit-icon" />
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className='questionario'>
      {showModalComponente && (
        <ModalConfirmacao
          onClose={() => setShowModalComponente(false)}
          mensagem={"Tem certeza que deseja iniciar o questionário?"}
          setQuestionarioAtivado={setQuestionarioAtivado}
        />
      )}
      {showModal &&
        <ModalFinalizacaoQuestionario onClose={() => setShowModal(false)} qtdAcertos={qtdAcertos} qtdPerguntas={perguntas.length} pontos={pontos} />}
      {!questionarioAtivado ? (
        <div className='ativar-questionario'>
          <div>
            <span className='titulo-estudo'>{titulo}</span>
            <button className='descricaoConteudo' onClick={() => setMostrarDescricaoConteudo(!mostrarDescricaoConteudo)} title="Descrição">

              <FaQuestionCircle className="custom-icon" />
            </button>
          </div>

          <div className='iniciar-questionario-perguntas'>

            <button className='button-ativar' onClick={ativarQuestionario}>
              {videoConteudo ? 'Iniciar questionário com vídeo' : 'Iniciar Questionário'}
            </button>

            <div className='quantidades-questionario qtd-perguntas' title='Quantidade de perguntas'>
              <span>{perguntas.length || 0}</span>
            </div>
          </div>

          <div>
            {user?.tipo_usuario === 'admin' && (
              <>
                {!videoConteudo && (
                  <>
                    <span>Adicionar vídeo</span>
                    <button className="button-adicionar-conteudo" onClick={handleEditarLinkVideo}>
                      <AiOutlineEdit className="icon" />
                    </button>
                  </>
                )}

                <span>Adicionar nova pergunta</span>
                <button className="button-adicionar-conteudo" onClick={handleNovoQuestionario}>
                  <AiOutlinePlus className="icon" />
                </button>

                <span>Adicionar materiais</span>
                <button className="button-adicionar-conteudo" onClick={handleAdicionarMateriais}>
                  <AiOutlinePlus className="icon" />
                </button>

              </>
            )}
          </div>

          {editarLinkVideo && (
            <div className="novo-questionario-container">
              <input
                type="text"
                placeholder="Link do vídeo"
                value={linkVideo}
                onChange={(e) => setLinkVideo(e.target.value)}
              />

              <button onClick={handleSalvarEditLinkVideo}>Salvar</button>
            </div>

          )}

          {adicionarMateriais && (
            <div className="novo-questionario-container">
              <input
                type="text"
                placeholder="Links dos materiais"
                value={linksMateriais}
                onChange={(e) => setLinksMateriais(e.target.value)}
              />

              <button onClick={handleAdicionaisMateriais}>Salvar</button>
            </div>

          )}

          {mostrarCampoQuestionario && (
            <div className="novo-questionario-container">
              <input
                type="text"
                placeholder="Digite a pergunta"
                value={novaPergunta}
                onChange={(e) => setNovaPergunta(e.target.value)}
              />
              <input
                type="text"
                placeholder="Letra A"
                value={letraA}
                onChange={(e) => setLetraA(e.target.value)}
              />

              <input
                type="text"
                placeholder="Letra B"
                value={letraB}
                onChange={(e) => setLetraB(e.target.value)}
              />

              <input
                type="text"
                placeholder="Letra C"
                value={letraC}
                onChange={(e) => setLetraC(e.target.value)}
              />

              <input
                type="text"
                placeholder="Letra D"
                value={letraD}
                onChange={(e) => setLetraD(e.target.value)}
              />

              <input
                type="text"
                placeholder="Letra da resposta correta"
                value={respostaCorreta}
                onChange={(e) => setRespostaCorreta(e.target.value)}
              />

              <input
                title='Tempo em que a pergunta irá aparecer (segundos)'
                type="text"
                placeholder="Tempo para aparecer. Ex: 0:30 ou 30 (segs)"
                value={minutagemPergunta}
                onChange={(e) => setMinutagemPergunta(e.target.value)}
              />

              <button onClick={handleSalvarNovoQuestionario}>Salvar</button>
            </div>
          )}

          {
            !mostrarDescricaoConteudo && materiais && materiais?.length > 0 && materiais[0] !== "" && (
              <div className='materiais-estudo'>
                <h2>Materiais para estudo</h2>
                <ul className='list-materiais'>
                  {materiais?.map((link, linkIndex) => (
                    <li className='li-materiais' key={linkIndex}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <IoBookOutline className='icone-material' />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          {
            !mostrarDescricaoConteudo &&
            <div className='feedback-e-instrucoes'>
              {
                perguntasErradas.length > 0 ? (
                  <div className='feeback-perguntas'>
                    <h2>Feedback</h2>
                    <span className='text-span'>Estude mais sobre</span>
                    <MdFeedback className='icon-feedback' title='Feedback baseado na última tentativa' />
                    <ul>
                      {perguntasErradas.map((pergunta) => (
                        <li key={pergunta?.id}>{pergunta?.pergunta}</li>
                      ))}
                    </ul>
                  </div>
                ) : null
              }

              <div className='instrucoes-estudo'>
                <h2>Instruções antes de iniciar o questionário</h2>
                <ul>
                  <li>Inicie o questionário quando estiver pronto.</li>
                  {
                    videoConteudo && <li>Um vídeo será inicializado e ao longo do tempo terá questões para responder.</li>
                  }
                  <li>Leia cada pergunta cuidadosamente antes de responder.</li>
                  {videoConteudo ? (
                    <li>Você terá 30 segundos para responder cada pergunta.</li>
                  ) : (
                    <li>Você terá 90 segundos para responder cada pergunta.</li>
                  )}

                </ul>
              </div>
            </div>
          }

          {
            mostrarDescricaoConteudo && (
              <div className='descricaoConteudo'>
                <p className='estudoDescription'>{descricao}</p>
              </div>
            )
          }
        </div>
      ) : perguntas.length > 0 ? (
        <>
          <span className='titulo-estudo'>{titulo}</span>
          {
            videoConteudo && !videoPausado ? (
              <div className="container">
                <div className="video-container">
                  <YouTubePlayer videoConteudo={videoConteudo} conjuntoMinutagemPergunta={conjuntoMinutagemPergunta} playerRef={videoRef} setVideoPausado={setVideoPausado} setMomentoVideo={setMomentoVideo} momentoVideo={momentoVideo} perguntaAtual={perguntaAtual} />
                </div>


                {user?.tipo_usuario === 'admin' && (
                  <div className="perguntas-container">
                    {user?.tipo_usuario === 'admin' &&
                      <>
                        {videoConteudo && (
                          <>
                            <div className='edit-link-icon'>
                              <h3>Editar vídeo</h3>
                              <button className="button-adicionar-conteudo" onClick={handleEditarLinkVideo}>
                                <AiOutlineEdit className="icon" />
                              </button>
                            </div>

                            {editarLinkVideo && (
                              <div className="novo-questionario-container">
                                <input
                                  type="text"
                                  placeholder="Link do vídeo"
                                  value={linkVideo}
                                  onChange={(e) => setLinkVideo(e.target.value)}
                                />
                                <button onClick={handleSalvarEditLinkVideo}>Salvar</button>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    }

                    {renderizarPerguntas()}


                  </div>)}

              </div>
            ) :
              (
                <>
                  <div className='tempo-restante'>
                    {tempoRestante}
                  </div>
                  <form className='container-questionario'>
                    <div key={perguntas[perguntaAtual].id} className='pergunta-item'>
                      <p>{`${perguntaAtual + 1}. ${perguntas[perguntaAtual].pergunta}`}</p>

                      <div className={`centralizar-perguntas ${perguntaAtual === 0 ? 'centralizar-unico-botao' : ''}`}>
                        <span className='opcao-span'>A. {perguntas[perguntaAtual].opcao_a}</span>
                        <input
                          type='radio'
                          name={`resposta-${perguntas[perguntaAtual].id}`}
                          value='A'
                          checked={respostas[perguntas[perguntaAtual].id] === 'A'}
                          onChange={() => handleRespostaChange('A')}
                        />
                      </div>

                      <div className='centralizar-perguntas'>
                        <span className='opcao-span'>B. {perguntas[perguntaAtual].opcao_b}</span>
                        <input
                          type='radio'
                          name={`resposta-${perguntas[perguntaAtual].id}`}
                          value='B'
                          checked={respostas[perguntas[perguntaAtual].id] === 'B'}
                          onChange={() => handleRespostaChange('B')}
                        />
                      </div>

                      <div className='centralizar-perguntas'>
                        <span className='opcao-span'>C. {perguntas[perguntaAtual].opcao_c}</span>
                        <input
                          type='radio'
                          name={`resposta-${perguntas[perguntaAtual].id}`}
                          value='C'
                          checked={respostas[perguntas[perguntaAtual].id] === 'C'}
                          onChange={() => handleRespostaChange('C')}
                        />
                      </div>

                      <div className='centralizar-perguntas'>
                        <span className='opcao-span'>D. {perguntas[perguntaAtual].opcao_d}</span>
                        <input
                          type='radio'
                          name={`resposta-${perguntas[perguntaAtual].id}`}
                          value='D'
                          checked={respostas[perguntas[perguntaAtual].id] === 'D'}
                          onChange={() => handleRespostaChange('D')}
                        />
                      </div>
                    </div>

                    <div className={`botoes outros-botoes'}`}>
                      <button
                        className='button-questionario'
                        type='button'
                        onClick={handleAvancar}
                      >
                        {perguntaAtual < perguntas.length - 1 ? 'Próxima' : 'Finalizar'}
                      </button>
                    </div>


                  </form>

                  {user?.tipo_usuario === 'admin' && renderizarPerguntas()}
                </>
              )
          }
        </>
      ) : (
        <div className='questionario-off'>
          <button className='button-voltar' onClick={() => navigate(-1)}>
            <FiArrowLeft className='icon' />
            Voltar
          </button>
          <h2 className='questinario-title'>Questionário não disponível</h2>
        </div>
      )}

      {
        mostrarCampoEditarPerguntas && (
          <ModalEditarPergunta onClose={() => setMostrarCampoEditarPerguntas(false)} pergunta={perguntaSelecionada} />
        )
      }

      {showModalComponentePergunta && (
        <ModalConfirmacao
          onClose={() => setShowModalComponentePergunta(false)}
          mensagem={"Tem certeza que deseja excluir a pergunta?"}
          onConfirm={handleDeletePergunta}
        />
      )}
    </div>
  );
};

export default Questionario;