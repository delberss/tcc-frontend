
import React from 'react';
export const getButtonStyleByType = (tipo: string): React.CSSProperties => {
    let backgroundColor = '';
  
    switch (tipo.toLowerCase()) {
      case 'backend':
        backgroundColor = 'rgb(16, 74, 29)'; 
        break;
      case 'frontend':
        backgroundColor = 'rgb(40, 82, 94)';
        break;
      case 'database':
        backgroundColor = '#C25C09';
        break;
      case 'mobile':
        backgroundColor = 'rgb(150, 26, 15)';
        break;
      case 'devops e automação de infraestrutura':
        backgroundColor = '#9E9F04';
        break;
      case 'ux e design':
        backgroundColor = 'rgb(89, 143, 158)';
        break;
      default:
        backgroundColor = '#3498db';
    }
  
    const buttonStyles: React.CSSProperties = {
      backgroundColor,
      boxShadow: `1px 1px 5px ${backgroundColor}`,
    };
  
    return buttonStyles;
  };
  
export const getButtonStyle = (tipo: string): React.CSSProperties => {
    return getButtonStyleByType(tipo);
  };
  