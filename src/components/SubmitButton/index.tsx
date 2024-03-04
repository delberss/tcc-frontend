// SubmitButton.tsx
import React from 'react';

interface SubmitButtonProps {
  label: string;
  className?: string; // Tornar className opcional
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, className = 'logar' }) => {
  return <input className={className} type="submit" value={label} />;
};

export default SubmitButton;
