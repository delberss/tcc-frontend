import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { getButtonStyle } from '../../../color-estudos';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineSearch } from 'react-icons/ai';

import { useAuth } from '../../AuthContext';

interface PreferenciaEstudo {
  id: number;
  nome: string;
  linguagens: string[];
}


const Estudos: React.FC = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [tiposDeEstudo, setTiposDeEstudo] = useState<string[]>([]);
  const [estudos, setEstudos] = useState([]);

  const [novoEstudoNome, setNovoEstudoNome] = useState<string>('');
  const [novoEstudoDescricao, setNovoEstudoDescricao] = useState<string>('');

  const [novoEstudoLinguagens, setNovoEstudoLinguagens] = useState<string>('');

  const [novoEstudoLink, setNovoEstudoLink] = useState<string>('');

  const [mostrarCampoNovoEstudo, setMostrarCampoNovoEstudo] = useState<boolean>(false);

  const [informacoesEstudo, setInformacoesEstudo] = useState<string[]>([]);
  const [exibirTodosEstudos, setExibirTodosEstudos] = useState(user?.tipo_usuario === 'admin' ? true : false);
  const [preferenciaEstudo, setPreferenciaEstudo] = useState<PreferenciaEstudo[] | null>(null);

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
    const fetchData = async () => {
      try {
        const responseUsuario = await fetch(`${import.meta.env.REACT_APP_API_URL}/user-preference-study/${user?.id}`);
        const dataUsuario = await responseUsuario.json();

        if (dataUsuario.success) {
          setPreferenciaEstudo(dataUsuario.preferenciaEstudos);
        } else {
          console.error('Erro ao obter preferenciaEstudo:', dataUsuario.message);
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchTiposDeEstudo = async () => {
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/estudos`);
        const data = await response.json();
        const estudosData = data.map(({ id, nome, linguagens }: { id: number, nome: string, linguagens: string[] }) => ({ id, nome, linguagens }));

        setEstudos(estudosData);
        const tipos = data.map((estudo: any) => estudo.nome);
        setTiposDeEstudo(tipos);
      } catch (error) {
        console.error('Erro ao buscar tipos de estudo:', error);
      }
    };

    fetchTiposDeEstudo();
  }, []);

  const handleNovoEstudo = () => {
    setMostrarCampoNovoEstudo(!mostrarCampoNovoEstudo);
  };

  const handleSalvarNovoEstudo = async () => {
    if (
      novoEstudoNome.trim() === '' ||
      novoEstudoDescricao.trim() === '' ||
      novoEstudoLinguagens.trim() === '' ||
      novoEstudoLink.trim() === '' // Remova a vírgula extra aqui
    ) {
      alert('Por favor, preencha todos os campos antes de salvar.');
      return;
    }

    const linguagensArray = novoEstudoLinguagens.split(",").map(linguagem => linguagem.trim()); // Convertendo a string de linguagens em um array


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
          link: novoEstudoLink
        }),
      });

      if (response.ok) {
        setTiposDeEstudo([...tiposDeEstudo, novoEstudoNome]);
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
              // Filtra estudos com base no termo de busca nas linguagens
              .filter(estudo => termoBusca === '' || estudo.linguagens.some(linguagem => linguagem.toLowerCase().includes(termoBusca.toLowerCase())))
              // Ordena os estudos pelo nome em ordem alfabética
              .sort((a, b) => a.nome.toLowerCase().localeCompare(b.nome.toLowerCase()))
              // Mapeia os estudos filtrados e ordenados para renderizar botões
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
        ) : null // Retorna nulo se preferenciaEstudo for falso ou vazio
      )}



    </>
  );
};

export default Estudos;
