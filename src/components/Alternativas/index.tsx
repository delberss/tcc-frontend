import React, { ChangeEvent } from 'react';
import './index.css'

interface AlternativaProps {
  questionId: number;
  option: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Alternativa: React.FC<AlternativaProps> = ({ questionId, option, checked, onChange }) => (
  <label className='alternativa'>
    <input
      type={questionId === 3 ? "radio" : "checkbox"} // Alterado para verificar se é a terceira pergunta
      name={`question${questionId}`} // Nome do grupo de opções baseado no ID da pergunta
      value={option}
      checked={checked}
      onChange={onChange}
    />
    <span className='title-option'>{option}</span>
  </label>
);

export default Alternativa;
