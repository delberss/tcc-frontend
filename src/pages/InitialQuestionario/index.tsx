import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SubmitButton from '../../components/SubmitButton';
import Alternativa from '../../components/Alternativas'; // Importando o componente Alternativa
import './index.css';

interface FormData {
  respostas: { pergunta_id: number; resposta_do_usuario: string[] }[];
  userData: { email: string, username: string };
}

interface Question {
  id: number;
  text: string;
  opcoes: string[];
}

const InitialQuestionario: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState<FormData>({
    respostas: [],
    userData: {
      email: '',
      username: '',
    }
  });

  useEffect(() => {
    if (location.state && location.state.userData) {
      setUserData((prevData) => ({
        ...prevData,
        userData: location.state.userData
      }));
    }
  }, [location.state]);

  const [respostasPorPergunta, setRespostasPorPergunta] = useState<{ [key: number]: string[] }>({});

  const questions: Question[] = [
    {
      id: 1,
      text: 'Qual linguagem de programação você tem mais experiência prévia ou conhecimento?',
      opcoes: ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'C++', 'Swift', 'N/A']
    },
    {
      id: 2,
      text: 'Qual dessas linguagens de programação você está mais interessado em explorar e aprofundar?',
      opcoes: ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'C++', 'Swift', 'N/A']
    },
    {
      id: 3,
      text: 'Como você considera seu nível de habilidade em programação?',
      opcoes: ['Iniciante', 'Intermediário', 'Avançado']
    },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>, questionId: number) => {
    const { value, checked } = e.target;
  
    setRespostasPorPergunta((prevState) => {
      if (questions[questionId - 1].opcoes.length === 1) {
        return {
          ...prevState,
          [questionId]: checked ? [value] : []
        };
      } else {
        const newSelectedOptions = checked
          ? [...(prevState[questionId] || []), value]
          : (prevState[questionId] || []).filter((option) => option !== value);
  
        return {
          ...prevState,
          [questionId]: newSelectedOptions
        };
      }
    });
  };
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isAnyQuestionNotAnswered = questions.some(
      (question) => !respostasPorPergunta.hasOwnProperty(question.id)
    );

    if (isAnyQuestionNotAnswered) {
      alert('Por favor, responda todas as perguntas antes de enviar o formulário.');
    } else {
      try {
        const respostas = Object.entries(respostasPorPergunta).map(([pergunta_id, resposta_do_usuario]) => ({
          pergunta_id: parseInt(pergunta_id),
          resposta_do_usuario
        }));

        const userData = {
          respostas,
          userData: {
            email: location.state.userData.email,
            username: location.state.userData.username
          }
        };

        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/questionnaire-responses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
        }

        navigate('/conquistas');

      } catch (error) {
        console.error('Erro ao registrar respostas', error);
      }
    }
  };


  return (
    <div className='container-initial-questionario'>
      <h2>Formulário</h2>

      <form className='initial-questionario' onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            <label>{`${question.id}. ${question.text}`}</label>

            <div className="radio-options">
              {question.id === 3 ? (
                question.opcoes.map((option) => (
                  <Alternativa
                    key={option}
                    questionId={question.id}
                    option={option}
                    checked={respostasPorPergunta[question.id]?.includes(option)}
                    onChange={(e) => handleChange(e, question.id)}
                  />

                ))
              ) : (
                question.opcoes.map((option) => (
                  <Alternativa
                    key={option}
                    questionId={question.id}
                    option={option}
                    checked={respostasPorPergunta[question.id]?.includes(option)}
                    onChange={(e) => handleChange(e, question.id)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
        <SubmitButton label="Enviar" className="submit-form" />
      </form>
    </div>
  );



};

export default InitialQuestionario;
