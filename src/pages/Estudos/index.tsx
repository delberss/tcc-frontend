import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { getButtonStyle } from '../../../color-estudos';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineSearch } from 'react-icons/ai';

import { useAuth } from '../../AuthContext';
import { useEstudosStore } from '../../store/useEstudosStore';

const Estudos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { estudos, preferenciaEstudo, fetchEstudos, fetchPreferenciaEstudo, adicionarEstudo } = useEstudosStore();
  const [novoEstudoNome, setNovoEstudoNome] = useState<string>('');
  const [novoEstudoDescricao, setNovoEstudoDescricao] = useState<string>('');
  const [novoEstudoLinguagens, setNovoEstudoLinguagens] = useState<string>('');
  const [novoEstudoLink, setNovoEstudoLink] = useState<string>('');
  const [mostrarCampoNovoEstudo, setMostrarCampoNovoEstudo] = useState<boolean>(false);
  const [exibirTodosEstudos, setExibirTodosEstudos] = useState(user?.tipo_usuario === 'admin' ? true : false);
  const [termoBusca, setTermoBusca] = useState<string>('');

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchEstudos();
      fetchPreferenciaEstudo(Number(user.id)); // Converta user.id para número aqui
    }
  }, [user, fetchEstudos, fetchPreferenciaEstudo]);

  const handleNovoEstudo = () => {
    setMostrarCampoNovoEstudo(!mostrarCampoNovoEstudo);
  };

  const handleSalvarNovoEstudo = async () => {
    if (
      novoEstudoNome.trim() === '' ||
      novoEstudoDescricao.trim() === '' ||
      novoEstudoLinguagens.trim() === '' ||
      novoEstudoLink.trim() === ''
    ) {
      alert('Por favor, preencha todos os campos antes de salvar.');
      return;
    }

    const linguagensArray = novoEstudoLinguagens.split(",").map(linguagem => linguagem.trim());

    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/adicionarEstudo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: novoEstudoNome,
          descricao: novoEstudoDescricao,
          linguagens: linguagensArray,
          link: novoEstudoLink,
        }),
      });

      if (response.ok) {
        const novoEstudo = {
          id: estudos.length + 1, // ajuste conforme necessário para o seu caso
          nome: novoEstudoNome,
          linguagens: linguagensArray,
        };
        adicionarEstudo(novoEstudo);
        window.location.reload();
      } else {
        if (response.status === 400) {
          alert('Este estudo já existe');
          return;
        } else {
          const errorMessage = await response.json();
          console.error('Erro ao adicionar novo estudo:', errorMessage.message);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar novo estudo:', error);
    }

    setMostrarCampoNovoEstudo(!mostrarCampoNovoEstudo);
    setNovoEstudoNome('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSalvarNovoEstudo();
    }
  };

  const handleBuscaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermoBusca(event.target.value);
  };

  return (
    <>
      <div className='title-add-estudo'>
        <div className='todos-indicados'>
          <button className={`estudos-title ${exibirTodosEstudos ? 'exibirSelecionado' : 'naoSelecionado'}`} onClick={() => setExibirTodosEstudos(true)}>Todos</button>
          {
            user?.tipo_usuario !== 'admin' &&
            <button className={`estudos-title ${!exibirTodosEstudos ? 'exibirSelecionado' : 'naoSelecionado'}`} onClick={() => setExibirTodosEstudos(false)}>Indicados
            </button>
          }
        </div>

        {user?.tipo_usuario === 'admin' && (
          <button className="button-adicionar" onClick={handleNovoEstudo}>
            {
              !mostrarCampoNovoEstudo ? <AiOutlinePlus className="icon" /> : <AiOutlineMinus className="icon" />
            }
          </button>
        )}

      </div>

      {mostrarCampoNovoEstudo && (
        <div className="novo-estudo-container">
          <input
            type="text"
            placeholder="Nome do novo estudo"
            value={novoEstudoNome}
            onChange={(e) => setNovoEstudoNome(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descrição"
            value={novoEstudoDescricao}
            onChange={(e) => setNovoEstudoDescricao(e.target.value)}
          />

          <input
            type="text"
            placeholder="Linguagens/ferramentas. Ex: Python, Java"
            value={novoEstudoLinguagens}
            onChange={(e) => setNovoEstudoLinguagens(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <input
            type="text"
            placeholder="Link do Roadmap"
            value={novoEstudoLink}
            onChange={(e) => setNovoEstudoLink(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSalvarNovoEstudo}>Salvar</button>
        </div>
      )}

      <div className='termoBuscaEstudo'>
        <div className='input-container'>
          <AiOutlineSearch className='search-icon' />
          <input
            type="text"
            placeholder="Buscar por linguagem/ferramenta"
            value={termoBusca}
            onChange={handleBuscaChange}
          />
        </div>
      </div>

      {exibirTodosEstudos ? (
        <div className='container-estudos'>
          {estudos && estudos.length > 0 &&
            estudos
              .filter((estudo: any) => termoBusca === '' || (estudo.linguagens && estudo.linguagens.some((linguagem: string) => linguagem.toLowerCase().includes(termoBusca.toLowerCase()))))
              .sort((a: any, b: any) => a.nome.toLowerCase().localeCompare(b.nome.toLowerCase())) // Ordena os estudos por nome
              .map((estudo: any, index: number) => (
                <button
                  key={index}
                  className={`button-${estudo.nome.toLowerCase()} button-estudos`}
                  style={getButtonStyle(estudo.nome)}
                  onClick={() => navigate(`/estudos/${encodeURIComponent(estudo.nome.toLowerCase())}`)}
                >
                  {estudo.nome}
                </button>
              ))}
        </div>
      ) : (
        preferenciaEstudo ? (
          <div className='container-estudos'>
            {preferenciaEstudo
              .filter(estudo => termoBusca === '' || estudo.linguagens.some(linguagem => linguagem.toLowerCase().includes(termoBusca.toLowerCase())))
              .sort((a, b) => a.nome.toLowerCase().localeCompare(b.nome.toLowerCase()))
              .map((estudo, index) => (
                <button
                  className={`button-${estudo.nome.toLowerCase()} button-estudos`}
                  style={getButtonStyle(estudo.nome)}
                  onClick={() => navigate(`/estudos/${encodeURIComponent(estudo.nome.toLowerCase())}`)}
                  key={index}
                >
                  {estudo.nome}
                </button>
              ))}
          </div>
        ) : null
      )}
    </>
  );
};

export default Estudos;
