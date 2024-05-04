// ModalConfirmacao.js

import React from 'react';
import './index.css';

type SetQuestionarioAtivado = React.Dispatch<React.SetStateAction<boolean>>;

interface ModalProps {
    onClose: () => void;
    mensagem: string;
    onConfirm?: () => void; // Adicionando propriedade para confirmar a exclusão
    setQuestionarioAtivado?: SetQuestionarioAtivado; // Adicionando '?' para tornar opcional
}

const ModalConfirmacao: React.FC<ModalProps> = ({ onClose, mensagem, onConfirm, setQuestionarioAtivado }) => {
    const handleModalClose = () => {
        onClose();
    };

    const handleSimClick = () => {
        if(onConfirm){
            onConfirm(); // Chamando a função de confirmação quando o usuário clica em "Sim"
            window.location.reload();
            onClose();
        }
        if (setQuestionarioAtivado) {
            setQuestionarioAtivado(true);
        }
        onClose();
    };
    

    return (
        <div className="modal">
            <div className="modal-componente-content">
                <p>{mensagem}</p>
                <div className='modal-componente-buttons'>
                    <button onClick={handleSimClick}>Sim</button>
                    <button onClick={handleModalClose}>Não</button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacao;
