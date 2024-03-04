import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/FormFieldProps';
import ErrorMessage from '../../components/ErrorMessage';
import SubmitButton from '../../components/SubmitButton';
import './index.css';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const apiUrl = `${import.meta.env.REACT_APP_API_URL}/register`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        navigate('/login');
      } else {
        const data = await response.json();

        if (data.message && data.message.includes('E-mail já foi usado')) {
          setFormError('E-mail já está em uso. Por favor, escolha outro.');
        } else {
          console.error('Erro ao registrar o usuário');
        }
      }
    } catch (error) {
      console.error('Erro ao enviar o formulário');
    }
  };

  return (
    <div className='container-register'>
      <h2>Registre-se</h2>

      <form className='form-register' onSubmit={handleSubmit}>
        <FormField
          label="Nome"
          type="text"
          name="name"
          id="name"
          placeholder="Digite seu nome"
          value={formData.name}
          onChange={handleChange}
        />

        <FormField
          label="Email"
          type="email"
          name="email"
          id="email"
          placeholder="Digite seu email"
          value={formData.email}
          onChange={handleChange}
        />

        <FormField
          label="Senha"
          type="password"
          name="password"
          id="password"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={handleChange}
        />

        <ErrorMessage message={formError} />

        <SubmitButton label="Registrar-se" />

        <div className='login-from-register'>
          <span>
            Já possui uma conta? <a href={'/login'}> Fazer login</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;