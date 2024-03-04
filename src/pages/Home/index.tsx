import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../AuthContext';
import { getButtonStyle } from '../../../color-estudos';


interface PreferenciaEstudo {
  id: number;
  nome: string;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [preferenciaEstudo, setPreferenciaEstudo] = useState<PreferenciaEstudo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch preferenciaEstudo do usuário
        const responseUsuario = await fetch(`${import.meta.env.REACT_APP_API_URL}/user-preference-study/${user?.id}`);
        const dataUsuario = await responseUsuario.json();

        if (dataUsuario.success) {
          // Atualiza o estado com os dados obtidos
          setPreferenciaEstudo(dataUsuario.preferenciaEstudo);
        } else {
          console.error('Erro ao obter preferenciaEstudo:', dataUsuario.message);
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchData();
  }, [user]);


  return (
    <div className='container-home'>
      <Outlet />
      {user ? (
        <>
          <h2>Estudo indicado</h2>
          {preferenciaEstudo && (
            <div className='container-estudos'>
              <button
                key={preferenciaEstudo?.id}
                className={`button-${preferenciaEstudo?.nome.toLowerCase()}`}
                style={getButtonStyle(preferenciaEstudo?.nome)}
                onClick={() => navigate(`/estudos/${encodeURIComponent(preferenciaEstudo?.nome.toLowerCase())}`)}
              >
                {preferenciaEstudo?.nome}
              </button>
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
  
};

export default Home;
