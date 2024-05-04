import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import FormField from '../../components/FormFieldProps';
import ErrorMessage from '../../components/ErrorMessage';
import SubmitButton from '../../components/SubmitButton';
import './index.css';

interface FormData {
  emailOrUsername: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    emailOrUsername: '',
    password: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const [userType, setUserType] = useState<string>('estudante');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.emailOrUsername || !formData.password) {
      setFormError('Por favor, preencha todos os campos');
      return;
    }

    try {
      const apiUrl = `${import.meta.env.REACT_APP_API_URL}/login`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userType }), // Adicionando userType ao corpo da requisição
      });

      if (response.status === 200) {
        const { user, token } = await response.json();
        console.log(user)

        login(user, token);

        const nextPageState = {
          userData: {
            ...formData,
            ...(formData.emailOrUsername.includes('@')
              ? { email: formData.emailOrUsername } // Se contiver '@', atribui como email
              : { username: formData.emailOrUsername } // Se não contiver '@', atribui como username
            )
          },
        };
        

        if (userType.toLocaleLowerCase() === 'estudante' && user.preferenciaEstudo === null) {
          navigate('/form-register', { state: nextPageState });
        } else {
          navigate('/conquistas', { state: nextPageState });
        }
      } else {
        const data = await response.json();

        if (data.message && data.message.includes('A senha inserida está incorreta.')) {
          setFormError('A senha inserida está incorreta.');
        } else if (data.message && data.message.includes('Email não existe para esse login')) {
          setFormError('Email não existe para esse login');
        } else if (data.message && data.message.includes('E-mail não cadastrado.')) {
          setFormError('E-mail não cadastrado. Faça o registro.');
        } else {
          console.error('Erro ao enviar o formulário:', response.statusText);
          setFormError('Erro ao enviar o formulário. Por favor, tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      setFormError('Erro ao enviar o formulário. Por favor, tente novamente.');
    }
  };

  const toggleUserType = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setUserType(userType === 'estudante' ? 'admin' : 'estudante');
  };

  return (
    <div className='container-login'>
      <h2>Login</h2>

      <form className='form-login' onSubmit={handleSubmit}>
        <FormField
          label='Email ou Usuário'
          type='text'
          name='emailOrUsername'
          id='emailOrUsername'
          placeholder='Digite seu email ou usuário'
          value={formData.emailOrUsername}
          onChange={handleChange}
        />

        <FormField
          label='Senha'
          type='password'
          name='password'
          id='password'
          placeholder='Digite sua senha'
          value={formData.password}
          onChange={handleChange}
        />

        <ErrorMessage message={formError} />

        <SubmitButton label='Logar' />

        <button className={`toggle-button ${userType === 'estudante' ? '' : 'admin'}`} onClick={toggleUserType}>
          <span className='text'>{userType === 'admin' ? 'Administrador' : userType}</span>
          <div className='slider'></div>
        </button>

        <div className='register-from-login'>
          <span>
            Não tem uma conta? <Link to='/register'>Registre-se</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
