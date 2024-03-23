import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../AuthContext';

interface NavBarProps {
    isAuthenticated: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated }) => {
    const { user } = useAuth();

    return (
        <nav>
            <ul className='menu-list'>

                {isAuthenticated && user?.tipo_usuario === 'estudante' && (
                    <li className='item'>
                        <Link to='/conquistas' className='menu-link'>Conquistas</Link>
                    </li>
                )}
                <li className='item'>
                    <Link to='/estudos' className='menu-link'>Estudos</Link>
                </li>
                <li className='item'>
                    <Link to='/ranking' className='menu-link'>Ranking</Link>
                </li>
                <li className='item'>
                    <Link to='/sobre' className='menu-link'>Sobre</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
