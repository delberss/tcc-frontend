import React, { ChangeEvent } from 'react';

interface AlternativaProps {
  questionId: number;
  option: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const Alternativa: React.FC<AlternativaProps> = ({ questionId, option, checked, onChange }) => (
    <div className='alternativa'>
      <input
        type="radio"
        name={`question${questionId}`} // Nome do grupo de opções baseado no ID da pergunta
        value={option}
        checked={checked}
        onChange={onChange}
      />
      <span>{option}</span>
    </div>
  );
  
  export default Alternativa;