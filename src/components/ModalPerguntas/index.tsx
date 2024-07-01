import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import './index.css';
import { useAuth } from '../../AuthContext';
import ModalConfirmacao from '../ModalConfirmacao';
import { converterParaSegundos } from '../../funcoes/converterParaSegundos';

interface Pergunta {
    id: number;
    pergunta: string;
    opcao_a: string;
    opcao_b: string;
    opcao_c: string;
    opcao_d: string;
    resposta_correta?: string;
    minutagempergunta: number;
}

interface ModalProps {
    onClose: () => void;
    onDelete?: (id: number) => void;
    onSave?: (pergunta: Pergunta) => void;
    pergunta: Pergunta; 
}



const ModalEditarPergunta: React.FC<ModalProps> = ({ onClose, pergunta, onSave }) => {
    const { token } = useAuth();
    const [editedPergunta, setEditedPergunta] = useState<Pergunta>(pergunta);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, campo: string) => {
        const { value } = event.target;
        setEditedPergunta(prevState => ({
            ...prevState,
            [campo]: value
        }));
    };

    const handleSalvarPerguntaEditada = async () => {

        try {
            const minutagem = converterParaSegundos(String(editedPergunta.minutagempergunta));

            const requestBody: any = {
                pergunta: editedPergunta.pergunta,
                opcao_a: editedPergunta.opcao_a,
                opcao_b: editedPergunta.opcao_b,
                opcao_c: editedPergunta.opcao_c,
                opcao_d: editedPergunta.opcao_d,
                minutagemPergunta: minutagem,
            };

            if (editedPergunta.resposta_correta && editedPergunta.resposta_correta.trim() !== '') {
                requestBody.resposta_correta = editedPergunta.resposta_correta.toLocaleUpperCase();
            }

            const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/pergunta/${pergunta.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Pergunta editada com sucesso');
                window.location.reload();
                onClose();
            } else {
                console.error('Erro ao editar pergunta:', data.message);
            }
        } catch (error) {
            console.error('Erro ao editar pergunta:', error);
        }
    };

    return (
        <>


            <div className="modal-editar-pergunta">
                <div className="modal-editar-pergunta-content">
                    <div key={pergunta.id} className="pergunta-item">
                        <div className="pergunta-header">
                            <h2>Pergunta</h2>
                        </div>
                        <input
                            type="text"
                            value={editedPergunta.pergunta}
                            onChange={(e) => handleChange(e, 'pergunta')}
                            placeholder="Pergunta"
                        />

                        <div className='h3-input'>
                            <h3>A)</h3>
                            <input
                                type="text"
                                value={editedPergunta.opcao_a}
                                onChange={(e) => handleChange(e, 'opcao_a')}
                                placeholder="Alternativa A"
                            />
                        </div>

                        <div className='h3-input'>
                            <h3>B)</h3>
                            <input
                                type="text"
                                value={editedPergunta.opcao_b}
                                onChange={(e) => handleChange(e, 'opcao_b')}
                                placeholder="Alternativa B"
                            />
                        </div>

                        <div className='h3-input'>
                            <h3>C)</h3>
                            <input
                                type="text"
                                value={editedPergunta.opcao_c}
                                onChange={(e) => handleChange(e, 'opcao_c')}
                                placeholder="Alternativa C"
                            />
                        </div>

                        <div className='h3-input'>
                            <h3>D)</h3>
                            <input
                                type="text"
                                value={editedPergunta.opcao_d}
                                onChange={(e) => handleChange(e, 'opcao_d')}
                                placeholder="Alternativa D"
                            />
                        </div>

                        <div className='h3-input'>
                            <h3>Resposta Correta</h3>
                            <input
                                type="text"
                                value={editedPergunta.resposta_correta || ''}
                                onChange={(e) => handleChange(e, 'resposta_correta')}
                                placeholder="Resposta Correta (A, B, C ou D)"
                            />
                        </div>

                        <div className='h3-input'>
                            <h3>Minutagem</h3>
                            <input
                                type="text"
                                value={editedPergunta.minutagempergunta}
                                onChange={(e) => handleChange(e, 'minutagempergunta')}
                                placeholder="Minutagem. Ex: 0:30 ou 30 (segs)"
                            />
                        </div>

                    </div>
                    <div className="modal-editar-pergunta-buttons">
                        <button onClick={handleSalvarPerguntaEditada}>Salvar</button>
                        <button onClick={onClose}>Cancelar</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalEditarPergunta;
