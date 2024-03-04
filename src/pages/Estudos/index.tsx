import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { getButtonStyle } from '../../../color-estudos';


const Estudos: React.FC = () => {
  const navigate = useNavigate();
  const [tiposDeEstudo, setTiposDeEstudo] = useState<string[]>([]);

  useEffect(() => {
    const fetchTiposDeEstudo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/estudos`);
        const data = await response.json();

        // Extrair os tipos de estudo da resposta
        const tipos = data.map((estudo: any) => estudo.nome);
        setTiposDeEstudo(tipos);
      } catch (error) {
        console.error('Erro ao buscar tipos de estudo:', error);
      }
    };

    fetchTiposDeEstudo();
  }, []);


  return (
    <div className='container-estudos'>
      {tiposDeEstudo.map((estudo, index) => (
        <button
          key={index}
          className={`button-${estudo.toLowerCase()}`}
          style={getButtonStyle(estudo)}
          onClick={() => navigate(`/estudos/${encodeURIComponent(estudo.toLowerCase())}`)}
        >
          {estudo}
        </button>
      ))}
    </div>
  );
};

export default Estudos;