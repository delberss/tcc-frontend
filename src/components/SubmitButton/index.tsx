import React from 'react';

interface SubmitButtonProps {
  label: string;
  className?: string; 
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, className = 'logar' }) => {
  return <input className={className} type="submit" value={label} />;
};

export default SubmitButton;
