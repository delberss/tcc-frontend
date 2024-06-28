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
  conteudoConcluido: boolean;
}

const ModalFinalizacaoQuestionario: React.FC<ModalProps> = ({ onClose, qtdAcertos, qtdPerguntas, pontos, conteudoConcluido }) => {
  const navigate = useNavigate();

  const handleModalClose = () => {
    onClose();
    navigate(-1);
  };

  const proxConteudoDesbloqueado = (qtdAcertos: any, qtdPerguntas: any) => {
    if(qtdAcertos == undefined){
      qtdAcertos = 0;
    }
    if(qtdPerguntas == undefined){
      qtdPerguntas = 0;
    }
    return qtdAcertos >= (qtdPerguntas * 0.60);
  }

  let mensagem = "";

  if(!conteudoConcluido){
    if (qtdAcertos === qtdPerguntas) {
      mensagem = `Parabéns! Você ganhou ${pontos} pontos e acertou 100% do questionário!`;
    } else if (proxConteudoDesbloqueado(qtdAcertos, qtdPerguntas)) {
      mensagem = `Parabéns! Você ganhou ${pontos} pontos. Próximo conteúdo desbloqueado`;
    } else {
      mensagem = "Revise os materiais novamente.";
    }
  } else{
    if (qtdAcertos === qtdPerguntas) {
      mensagem = `Parabéns! Você acertou 100% do questionário!`;
    } else if (proxConteudoDesbloqueado(qtdAcertos, qtdPerguntas)) {
      mensagem = `Parabéns! Você acertou mais de 60% do questionário`;
    } else {
      mensagem = "Revise os materiais novamente.";
    }
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