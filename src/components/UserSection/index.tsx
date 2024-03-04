// UserSection.tsx
import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './index.css';
import { User } from '../../types';

interface UserSectionProps {
  isAuthenticated: boolean;
  user: User | null;
  primeiroNome: string | undefined;
  openModal: () => void;
  handleLogout: () => void;
}

const UserSection: React.FC<UserSectionProps> = ({ isAuthenticated, user, primeiroNome, openModal, handleLogout }) => {
  return (
    <div className={isAuthenticated ? 'logged' : 'logged-out'}>
      {isAuthenticated ? (
        <div className='user-profile-info'>
          <div className='user-profile-image-container'>
            {user?.profileImageUrl ? (
              <button onClick={openModal}>
                <img
                  src={`${import.meta.env.REACT_APP_API_URL}/uploads/${user?.profileImageUrl}`}
                  alt={`Profile`}
                  className='user-profile-image'
                />
              </button>
            ) : (
              <FaUser onClick={openModal} className='default-profile-image' />
            )}
            <span className='user-greeting'>{primeiroNome}</span>
          </div>

          <div className='logout-button-container'>
            <button className='logout-button' onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      ) : (
        <div className='logged-out'>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
        </div>
      )}
    </div>
  );
};

export default UserSection;
