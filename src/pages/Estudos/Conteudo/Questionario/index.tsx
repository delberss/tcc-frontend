import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './index.css';
import { useAuth } from '../../../../AuthContext';
import { AiOutlinePlus } from 'react-icons/ai';

interface Pergunta {
  id: number;
  pergunta: string;
  opcao_a: string;
  opcao_b: string;
  opcao_c: string;
  opcao_d: string;
}


const Questionario: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  let conteudoId = location.state.conteudoId;
  let titulo = location.state.titulo;

  const [respostasEnviadas, setRespostasEnviadas] = useState(false);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [materiais, setMateriais] = useState<{ materiais: string[] }[]>([]);
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(90);
  const [questionarioAtivado, setQuestionarioAtivado] = useState(false);

  const [mostrarCampoQuestionario, setMostrarCampoQuestionario] = useState<boolean>(false);

  const [novaPergunta, setNovaPergunta] = useState<string>('');
  const [letraA, setLetraA] = useState<string>('');
  const [letraB, setLetraB] = useState<string>('');
  const [letraC, setLetraC] = useState<string>('');
  const [letraD, setLetraD] = useState<string>('');
  const [respostaCorreta, setRespostaCorreta] = useState<string>('');




  const ativarQuestionario = () => {
    setQuestionarioAtivado(true);
  };


  useEffect(() => {

    const fetchPerguntas = async () => {
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/perguntas/${conteudoId}`);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        setPerguntas(data);
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
      setMateriais(data);
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
    }
  };


  useEffect(() => {
    if (questionarioAtivado) {
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
  }, [questionarioAtivado, perguntaAtual]);


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
    } else {
      enviarRespostas();
    }
  };

  const enviarRespostas = async () => {
    if (Object.keys(respostas).length >= 0) {
      try {
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

        navigate(-1);
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




  return (
    <div className='questionario'>
      {!questionarioAtivado ? (
        <div className='ativar-questionario'>
          <span className='titulo-estudo'>{titulo}</span>
          <div className='iniciar-questionario-perguntas'>
            <button className='button-ativar' onClick={ativarQuestionario}>
              Iniciar Questionário
            </button>

            <div className='quantidades-questionario qtd-perguntas'>
              <span>{perguntas.length || 0}</span>
            </div>
          </div>


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
              <button onClick={handleSalvarNovoQuestionario}>Salvar</button>
            </div>
          )}


          {
            materiais && materiais.length > 0 && materiais[0].materiais ? (
              <div className='materiais-estudo'>
                <span className='subtitulos-estudo-questionario'>Materiais indicados para estudo</span>
                <ul>
                  {materiais[0].materiais.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className='materiais-estudo'>
                <span className='subtitulos-estudo-questionario'>Ainda não possui material</span>
              </div>
            )
          }

          <div className='instrucoes-estudo'>
            <span className='subtitulos-estudo-questionario'>Instruções antes de iniciar o questionário</span>
            <ul>
              <li>Inicie o questionário quando estiver pronto.</li>
              <li>Leia cada pergunta cuidadosamente antes de responder.</li>
              <li>Você terá 90 segundos para responder cada pergunta.</li>
            </ul>
          </div>
        </div>
      ) : perguntas.length > 0 ? (
        <>
          <span className='titulo-estudo'>{titulo}</span>
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