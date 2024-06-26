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
        const responseUsuario = await fetch(`${import.meta.env.REACT_APP_API_URL}/user-preference-study/${user?.id}`);
        const dataUsuario = await responseUsuario.json();

        if (dataUsuario.success) {
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

  useEffect(() => {
    if (!user) {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/sobre');
        }
        else{
          navigate('/conquistas')
        }
    }
}, [user, navigate]);

  return (
    <div className='container-home'>
      <Outlet />
    </div>
  );
  
};

export default Home;
