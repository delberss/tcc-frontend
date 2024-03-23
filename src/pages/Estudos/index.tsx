import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { getButtonStyle } from '../../../color-estudos';
import { AiOutlinePlus } from 'react-icons/ai'; // Importando o ícone de adição do React Icons
import { useAuth } from '../../AuthContext';

const Estudos: React.FC = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [tiposDeEstudo, setTiposDeEstudo] = useState<string[]>([]);
  const [novoEstudoNome, setNovoEstudoNome] = useState<string>(''); // Estado para armazenar o nome do novo estudo
  const [novoEstudoDescricao, setNovoEstudoDescricao] = useState<string>(''); // Estado para armazenar o nome do novo estudo
  const [novoEstudoLink, setNovoEstudoLink] = useState<string>(''); // Estado para armazenar o nome do novo estudo

  const [mostrarCampoNovoEstudo, setMostrarCampoNovoEstudo] = useState<boolean>(false); // Estado para controlar a exibição do campo de novo estudo

  const [informacoesEstudo, setInformacoesEstudo] = useState<string[]>([]);
  useEffect(() => {
    const fetchTiposDeEstudo = async () => {
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/estudos`);
        const data = await response.json();

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
      novoEstudoLink.trim() === '' // Remova a vírgula extra aqui
    ) {
      alert('Por favor, preencha todos os campos antes de salvar.');
      return;
    }
   
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/adicionarEstudo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nome: novoEstudoNome,
          descricao: novoEstudoDescricao,
          link: novoEstudoLink
        }),
      });

      if (response.ok) {
        setTiposDeEstudo([...tiposDeEstudo, novoEstudoNome]);
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


  return (
    <>
      <div className='title-add-estudo'>
        <h2 className='estudos-title'>Estudos</h2>
        {user?.tipo_usuario === 'admin' && (
          <button className="button-adicionar" onClick={handleNovoEstudo}>
            <AiOutlinePlus className="icon" />
          </button>
        )}

      </div>

      {mostrarCampoNovoEstudo && (
        <div className="novo-estudo-container">
          <input
            type="text"
            placeholder="Digite o nome do novo estudo"
            value={novoEstudoNome}
            onChange={(e) => setNovoEstudoNome(e.target.value)}
          />

          <input
            type="text"
            placeholder="Digite a descrição"
            value={novoEstudoDescricao}
            onChange={(e) => setNovoEstudoDescricao(e.target.value)}
          />

          <input
            type="text"
            placeholder="Digite o link de roadmap"
            value={novoEstudoLink}
            onChange={(e) => setNovoEstudoLink(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSalvarNovoEstudo}>Salvar</button>
        </div>
      )}

      <div className='container-estudos'>
        {tiposDeEstudo.map((estudo, index) => (
          <button
            key={index}
            className={`button-${estudo.toLowerCase()} button-estudos`}
            style={getButtonStyle(estudo)}
            onClick={() => navigate(`/estudos/${encodeURIComponent(estudo.toLowerCase())}`)}
          >
            {estudo}
          </button>
        ))}
      </div>
    </>
  );
};

export default Estudos;
