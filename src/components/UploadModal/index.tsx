import React from 'react';
import './index.css';
interface UploadModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    handleImageUpload: (file: File) => Promise<void>;
}

const UploadModal: React.FC<UploadModalProps> = ({ isModalOpen, closeModal, handleImageUpload }) => {
    return (
        isModalOpen && (
            <div className="upload-modal">
                <div className="modal-content">
                    <label className="custom-file-input">
                        Faça o upload
                        <input type="file" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
                    </label>
                    <button onClick={closeModal}>Fechar</button>
                </div>
            </div>
        )
    );
};

export default UploadModal;
