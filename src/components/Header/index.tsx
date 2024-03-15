import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

import './index.css';
import UploadModal from '../UploadModal';
import NavBar from '../NavBar';
import UserSection from '../UserSection';
import logo from '../../../src/assets/iconeoficial.png'


const Header: React.FC = () => {
  const { isAuthenticated, logout, user, token = null, updateProfileImage } = useAuth();
  const primeiroNome = user?.name.split(' ')[0];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };


  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        updateProfileImage(responseData.profile_image_url);

      } else {
        console.error('Falha ao fazer o upload da imagem:', responseData.message);
      }

      closeModal();
    } catch (error) {
      console.error('Erro ao fazer o upload da imagem', error);
    }
  };

  return (
    <header>
      <div className='logo' onClick={handleLogoClick}>
        <img src={logo} alt="logo" />
      </div>

      <div className='menu-header'>
        <NavBar isAuthenticated={isAuthenticated} />
      </div>

      <div className='user-section'>
        <UserSection
          isAuthenticated={isAuthenticated}
          user={user}
          primeiroNome={primeiroNome}
          openModal={openModal}
          handleLogout={handleLogout}
        />
      </div>

      <UploadModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        handleImageUpload={handleImageUpload}
      />
    </header>
  );
};

export default Header;