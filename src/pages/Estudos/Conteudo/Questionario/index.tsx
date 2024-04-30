import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../../../AuthContext';
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { IoBookOutline } from "react-icons/io5";
import { MdFeedback } from "react-icons/md";
import { FiArrowLeft } from 'react-icons/fi';
import YouTubePlayer from '../../../../components/YouTubePlayer';

interface Pergunta {
  id: number;
  pergunta: string;
  opcao_a: string;
  opcao_b: string;
  opcao_c: string;
  opcao_d: string;
  minutagempergunta: number;
}

interface PerguntaErrada {
  id: number;
  pergunta: string;
}

interface ModalProps {
  onClose: () => void;
  qtdAcertos: number;
}


const Questionario: React.FC = () => {
  const { token, user } = useAuth();
  const videoRef = useRef<HTMLDivElement>(null); // Inicializando com null
  const navigate = useNavigate();
  const location = useLocation();
  let conteudoId = location.state.conteudoId;
  let titulo = location.state.titulo;
  let tempomaximo = location.state.tempomaximo;


  const [respostasEnviadas, setRespostasEnviadas] = useState(false);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [materiais, setMateriais] = useState<{ materiais: string[] }[]>([]);
  const [videoConteudo, setVideoConteudo] = useState<string>(""); // Define o estado inicial como uma string vazia
  const [linkVideo, setLinkVideo] = useState<string>('');
  const [editarLinkVideo, setEditarLinkVideo] = useState<boolean>(false);



  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(90);
  const [questionarioAtivado, setQuestionarioAtivado] = useState(false);

  const [editingPerguntaId, setEditingPerguntaId] = useState(null);
  const [novaMinutagem, setNovaMinutagem] = useState('');
  const [perguntaId, setPerguntaId] = useState(null);



  const [mostrarCampoQuestionario, setMostrarCampoQuestionario] = useState<boolean>(false);

  const [novaPergunta, setNovaPergunta] = useState<string>('');
  const [letraA, setLetraA] = useState<string>('');
  const [letraB, setLetraB] = useState<string>('');
  const [letraC, setLetraC] = useState<string>('');
  const [letraD, setLetraD] = useState<string>('');
  const [minutagemPergunta, setMinutagemPergunta] = useState<number>(0);
  const [respostaCorreta, setRespostaCorreta] = useState<string>('');
  const [perguntasErradas, setPerguntasErradas] = useState<PerguntaErrada[]>([]);
  const [conjuntoMinutagemPergunta, setConjuntoMinutagemPergunta] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tempoCongelado, setTempoCongelado] = useState(false);
  const [qtdAcertos, setQtdAcertos] = useState(0);
  const [videoPausado, setVideoPausado] = useState(false);
  const [momentoVideo, setMomentoVideo] = useState(0);



  const ativarQuestionario = () => {
    setQuestionarioAtivado(true);
  };


  const handleEditarLinkVideo = () => {
    setEditarLinkVideo(!editarLinkVideo);
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

        // Ordenar as perguntas pelo ID antes de definir o estado
        data.sort((a, b) => a.id - b.id);

        console.log(data);
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

  useEffect(() => {
    console.log(conjuntoMinutagemPergunta)
  }, [conjuntoMinutagemPergunta])

  const fetchMateriais = async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/materiais/${conteudoId}`);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data)

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
        const remainingTime = Math.max(90 - elapsedTime, 0);
        setTempoRestante(remainingTime);
      };

      const intervalId = setInterval(updateTimer, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [tempoCongelado, questionarioAtivado, perguntaAtual, videoPausado]);


  useEffect(() => {
    if (!respostasEnviadas && tempoRestante === 0) {
      if (!respostas[perguntas[perguntaAtual].id]) {
        setRespostas((prevRespostas) => ({
          ...prevRespostas,
          [perguntas[perguntaAtual].id]: '',
        }));
      }

      if (perguntaAtual < perguntas.length - 1) {
        setPerguntaAtual((prevPergunta) => prevPergunta + 1);
        setTempoRestante(90);
        setVideoPausado(false);
      } else {
        enviarRespostas();
      }
    }
  }, [tempoRestante, respostas, perguntas, perguntaAtual]);

  const handleRespostaChange = (respostaSelecionada: string) => {
    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      [perguntas[perguntaAtual].id]: respostaSelecionada,
    }));
  };

  const handleAvancar = () => {
    setTempoRestante(90);

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


  const Modal: React.FC<ModalProps> = ({ onClose, qtdAcertos }) => {
    const handleModalClose = () => {
      onClose();
      navigate(-1);
    };

    let mensagem = "";
    if (qtdAcertos === perguntas.length) {
      mensagem = "Parabéns! Você acertou todas as questões e ganhou pontos!";
    } else if (qtdAcertos === perguntas.length - 1) {
      mensagem = "Muito bem! Você passou perto de gabaritar.";
    } else {
      mensagem = "Revise os materiais novamente.";
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Você acertou {qtdAcertos} de {perguntas.length} questões</h2>
          <p>{mensagem}</p>
          <button onClick={handleModalClose}>Sair</button>
        </div>
      </div>
    );
  };


  const enviarRespostas = async () => {
    if (Object.keys(respostas).length >= 0) {
      try {
        setTempoCongelado(true); // Congela o tempo
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
        const data = await response.json(); // Extrai os dados da resposta da API
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

  const handleSalvarNovoQuestionario = async () => {
    if (
      novaPergunta.trim() === '' ||
      letraA.trim() === '' ||
      letraB.trim() === '' ||
      letraC.trim() === '' ||
      letraD.trim() === '' ||
      respostaCorreta.trim() === ''
    ) {
      alert('Por favor, preencha todos os campos antes de salvar.');
      return;
    }

    try {
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
          minutagemPergunta: minutagemPergunta,
          resposta_correta: respostaCorreta.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMostrarCampoQuestionario(!mostrarCampoQuestionario);
        // Reload da página
        window.location.reload();
      } else {
        console.error('Erro ao adicionar pergunta:', data.message);
      }
    } catch (error) {
      console.error('Erro ao adicionar pergunta:', error);
    }
  };

  const handlePerguntaClick = (id) => {
    setEditingPerguntaId(id);
    setPerguntaId(id); // Define o ID da pergunta que está sendo editada
  };


  const converterParaSegundos = (minutagem) => {
    // Verificar se a entrada possui o formato "m:ss"
    const temDoisPontos = minutagem.includes(':');
  
    if (temDoisPontos) {
      // Separar a string em minutos e segundos
      const partes = minutagem.split(':');
  
      // Converter as partes para números inteiros
      const minutos = parseInt(partes[0], 10);
      const segundos = parseInt(partes[1], 10);
  
      // Calcular o total de segundos
      const totalSegundos = minutos * 60 + segundos;
  
      return totalSegundos;
    } else {
      // Se não houver dois pontos, assumir que a entrada é apenas o número de segundos
      return parseInt(minutagem, 10);
    }
  };
  


  const handleInputChange = (event) => {
    setNovaMinutagem(event.target.value);
  };

  useEffect(() => {
    console.log(perguntas)
  }, [perguntas])

  const handleSalvarNovaMinutagem = async () => {
    if (perguntaId === null || novaMinutagem.trim() === '') {
      alert('Por favor, selecione uma pergunta e insira a nova minutagem.');
      return;
    }

    // Converter a nova minutagem para segundos totais
    const novaMinutagemSegundos = converterParaSegundos(novaMinutagem);

    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/edit/pergunta/${perguntaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          minutagemPergunta: novaMinutagemSegundos, // Enviar a nova minutagem em segundos
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Atualizar a minutagem da pergunta no estado local
        setPerguntas((perguntas) => {
          return perguntas.map((pergunta) => {
            if (pergunta.id === perguntaId) {
              return { ...pergunta, minutagempergunta: novaMinutagemSegundos };
            }
            return pergunta;
          });
        });

        // Ordenar as perguntas pelo índice original
        setPerguntas((perguntas) => {
          return perguntas.slice().sort((a, b) => a.id - b.id);
        });

        // Sai do modo de edição
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
        method: 'PUT', // Alterado para PUT
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
        window.location.reload(); // Recarregar a página

      } else {
        console.error('Erro ao atualizar link do vídeo:', data.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar link do vídeo:', error);
    }
  };







  return (
    <div className='questionario'>
      {showModal &&
        <Modal onClose={() => setShowModal(false)} qtdAcertos={qtdAcertos} />}
      {!questionarioAtivado ? (
        <div className='ativar-questionario'>
          <span className='titulo-estudo'>{titulo}</span>
          <div className='iniciar-questionario-perguntas'>

            <button className='button-ativar' onClick={ativarQuestionario}>
              {videoConteudo ? 'Iniciar questionário com vídeo' : 'Iniciar Questionário'}
            </button>



            <div className='quantidades-questionario qtd-perguntas'>
              <span>{perguntas.length || 0}</span>
            </div>
          </div>

          <div>
            {user?.tipo_usuario === 'admin' && (
              <>
                <span>Editar vídeo</span>
                <button className="button-adicionar-conteudo" onClick={handleEditarLinkVideo}>
                  <AiOutlineEdit className="icon" />
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

          <div>
            {user?.tipo_usuario === 'admin' && (
              <>
                <span>Adicionar nova pergunta</span>
                <button className="button-adicionar-conteudo" onClick={handleNovoQuestionario}>
                  <AiOutlinePlus className="icon" />
                </button>
              </>

            )}
          </div>


         

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
                type="number"
                placeholder="Tempo para pergunta aparecer"
                value={minutagemPergunta}
                onChange={(e) => setMinutagemPergunta(parseInt(e.target.value))}
              />

              <button onClick={handleSalvarNovoQuestionario}>Salvar</button>
            </div>
          )}


          {
            materiais && materiais.length > 0 && materiais[0].materiais && (
              <div className='materiais-estudo'>
                <span className='subtitulos-estudo-questionario'>Materiais indicados para estudo</span>
                <ul className='list-materiais'>
                  {materiais[0].materiais.map((link, linkIndex) => (
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

          <div className='feedback-e-instrucoes'>
            {
              perguntasErradas.length > 0 ? (
                <div className='feeback-perguntas'>
                  <span className='subtitulos-estudo-questionario'>Estude mais sobre</span>
                  <MdFeedback className='icon-feedback' title='Feedback' />
                  <ul>
                    {perguntasErradas.map((pergunta) => (
                      <li key={pergunta?.id}>{pergunta?.pergunta}</li>
                    ))}
                  </ul>
                </div>
              ) : null
            }


            <div className='instrucoes-estudo'>
              <span className='subtitulos-estudo-questionario'>Instruções antes de iniciar o questionário</span>
              <ul>
                <li>Inicie o questionário quando estiver pronto.</li>
                {
                  videoConteudo && <li>Um vídeo será inicializado e ao longo do tempo terá questões para responder.</li>
                }
                <li>Leia cada pergunta cuidadosamente antes de responder.</li>
                <li>Você terá 90 segundos para responder cada pergunta.</li>
              </ul>
            </div>
          </div>


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
                    <h3>Alterar minutagem das perguntas</h3>
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
                            <span className="minutagem-text">{pergunta.minutagempergunta} segs</span>
                            <AiOutlineEdit onClick={() => handlePerguntaClick(pergunta.id)} className="edit-icon" />
                          </div>
                        )}
                      </div>
                    ))}
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
    </div>
  );
};

export default Questionario;