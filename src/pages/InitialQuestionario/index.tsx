import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SubmitButton from '../../components/SubmitButton';
import Alternativa from '../../components/Alternativas'; // Importando o componente Alternativa
import './index.css';

interface FormData {
  respostas: { pergunta_id: number; resposta_do_usuario: string }[];
  userData: { email: string };
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
      email: ''
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

  const questions: Question[] = [
    { id: 1, text: 'Qual área de estudo você mais tem experiência prévia ou conhecimento?', 
    opcoes: ['Backend', 'Frontend', 'Database', 'DevOps e Automação de Infraestrutura', 'Mobile', 'UX e Design', 'N/A'] },
    { id: 2, text: 'Qual dessas áreas de estudo você está mais interessado em explorar e aprofundar?', 
    opcoes: ['Backend', 'Frontend', 'Database', 'DevOps e Automação de Infraestrutura', 'Mobile', 'UX e Design', 'N/A'] },
    { id: 3, text: 'Como você considera seu nível como desenvolvedor?', 
    opcoes: ['Iniciante', 'Intermediário', 'Avançado'] },
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>, questionId: number) => {
    const { value } = e.target;

    setUserData((prevData) => ({
      ...prevData,
      respostas: [
        ...prevData.respostas,
        { pergunta_id: questionId, resposta_do_usuario: value }
      ]
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isAnyQuestionNotAnswered = questions.some(
      (question) => !userData.respostas.find((r) => r.pergunta_id === question.id)
    );

    if (isAnyQuestionNotAnswered) {
      alert('Por favor, responda todas as perguntas antes de enviar o formulário.');
    } else {
      try {
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

        navigate('/');

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
              {question.opcoes.map((option) => (
                <Alternativa
                  key={option}
                  questionId={question.id}
                  option={option}
                  checked={userData.respostas.some((r) => r.pergunta_id === question.id && r.resposta_do_usuario === option)}
                  onChange={(e) => handleChange(e, question.id)}
                />
              ))}
            </div>
          </div>
        ))}
        <SubmitButton label="Enviar" className="submit-form" />
      </form>
    </div>
  );
};

export default InitialQuestionario;
