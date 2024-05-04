import React from 'react';
import './index.css';

import avatar1 from '../../assets/avatar1.png'
import avatar2 from '../../assets/avatar2.png'
import avatar3 from '../../assets/avatar3.png'

interface UploadModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    handleAvatarSelection: (avatarUrl: string) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isModalOpen, closeModal, handleAvatarSelection }) => {
    const avatars = [
        avatar1,
        avatar2,
        avatar3
    ];

    return (
        isModalOpen && (
            <div className="upload-modal">
                <div className="modal-content">
                    <div className="avatar-options">
                        {avatars.map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className='avatares'
                                onClick={() => handleAvatarSelection(avatar)}
                            />
                        ))}
                    </div>
                    <button onClick={closeModal}>Fechar</button>
                </div>
            </div>
        )
    );
};

export default UploadModal;
