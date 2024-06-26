import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return message ? <div className="error-message-login">{message}</div> : null;
};

export default ErrorMessage;
