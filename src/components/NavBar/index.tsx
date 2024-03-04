import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

interface NavBarProps {
    isAuthenticated: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated }) => {
    return (
        <nav>
            <ul className='menu-list'>
                {/* <li className='item'>
                    <Link to='/' className='menu-link'>Home</Link>
                </li> */}

                {isAuthenticated && (
                    <>
                        <li className='item'>
                            <Link to='/conquistas' className='menu-link'>Conquistas</Link>
                        </li>
                        <li className='item'>
                            <Link to='/estudos' className='menu-link'>Estudos</Link>
                        </li>
                        <li className='item'>
                            <Link to='/ranking' className='menu-link'>Ranking</Link>
                        </li>
                        <li className='item'>
                            <Link to='/sobre' className='menu-link'>Sobre</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;
