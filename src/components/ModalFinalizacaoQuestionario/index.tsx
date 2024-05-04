import { useNavigate } from "react-router-dom";
import React from 'react';

interface Pergunta {
    id: number;
    pergunta: string;
    opcao_a: string;
    opcao_b: string;
    opcao_c: string;
    opcao_d: string;
    resposta_correta: string; // Adicione esta linha
    minutagempergunta: number;
  }

interface ModalProps {
    onClose: () => void;
    qtdAcertos?: number;
    pergunta?: Pergunta | null; // Adicione esta linha
    qtdPerguntas: number;
    pontos: number;
  }

const ModalFinalizacaoQuestionario: React.FC<ModalProps> = ({ onClose, qtdAcertos, qtdPerguntas, pontos }) => {
    const navigate = useNavigate();

    const handleModalClose = () => {
      onClose();
      navigate(-1);
    };

    let mensagem = "";
    if (qtdAcertos === qtdPerguntas) {
      mensagem = `Parabéns! Você acertou todas as questões e ganhou ${pontos} pontos!`;
    } else if (qtdAcertos === qtdPerguntas - 1) {
      mensagem = "Muito bem! Você passou perto de gabaritar. Tente novamente!";
    } else {
      mensagem = "Revise os materiais novamente e tente novamente.";
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Você acertou {qtdAcertos} de {qtdPerguntas} questões</h2>
          <p>{mensagem}</p>
          <button onClick={handleModalClose}>Sair</button>
        </div>
      </div>
    );
  };


export default ModalFinalizacaoQuestionario;