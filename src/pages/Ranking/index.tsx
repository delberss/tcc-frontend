import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext'; // Importe o contexto de autenticação
import './index.css';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
    pontuacao_geral: number;
    tipo_usuario: string;
    conclusoes: number;
}



const Ranking: React.FC = () => {
    const { token, user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserPosition, setCurrentUserPosition] = useState<number | null>(null);
    const visibleUsers = users.slice(0, 20);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                navigate('/login');
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        if(token !== null){
            const fetchUsers = async () => {
                try {
                    const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/users`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }
    
                    const data: User[] = await response.json();

                    console.log(response)

                    const filteredUsers = data.filter(u => u.tipo_usuario === 'estudante');

                    const sortedUsers = filteredUsers.sort((a, b) => {
                        if (b.pontuacao_geral !== a.pontuacao_geral) {
                            return b.pontuacao_geral - a.pontuacao_geral;
                        }
                        return b.conclusoes - a.conclusoes;
                    });
                    setUsers(sortedUsers);
    
                    const currentUserIndex = sortedUsers.findIndex((u) => user && u.email === user?.email);
                    setCurrentUserPosition(currentUserIndex + 1); // Adicione 1 porque as posições começam em 1
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };
    
            fetchUsers();
        }
    }, [user]);
    
    useEffect(() => {
        console.log(users)
    },[users])
    

    const medals = [
        <span key="gold" className="gold-medal icon-medal">🥇</span>,
        <span key="silver" className="silver-medal icon-medal">🥈</span>,
        <span key="bronze" className="bronze-medal icon-medal">🥉</span>,
    ];

    return user ? (
        <div className="table-container">
            <h2 className="ranking">Melhores classificados</h2>
            <table>
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>Pontuação</th>
                        <th title='Quantidade de conquistas na plataforma'>Conquistas</th> {/* Nova coluna */}
                    </tr>
                </thead>
                <tbody>
                    {visibleUsers.map((user, index) => (
                        <tr key={index} className={`table-row ${index === (currentUserPosition ?? 0) - 1 ? 'current-user-row' : ''} ${index < 3 ? 'highlighted-row' : ''}`}>
                            <td className={`position-cell ${index < 3 ? 'top-users' : ''}`}>
                                {index < 3 ? (
                                    <span className="medal-icon">{medals[index]}</span>
                                ) : (
                                    <span className='posicao'>{index + 1}</span>
                                )}
                            </td>
                            <td className={index < 3 ? 'top-users' : ''}>{user.name}</td>
                            <td className={index < 3 ? 'top-users' : ''}>{user.pontuacao_geral}</td>
                            <td>{user.conclusoes}</td> {/* Nova coluna */}
                        </tr>
                    ))}
                    {
                    user?.tipo_usuario === 'estudante' && currentUserPosition && currentUserPosition > 20 && (
                        <>
                            <tr className={`table-row ellipsis-row`}>
                                <td colSpan={4}><span className='ellipsis'>...</span></td> {/* Atualize o colspan para 4 */}
                            </tr>
                            <tr className={`table-row current-user-row`}>
                                <td><span className='posicao'>{currentUserPosition}</span></td>
                                <td>{user?.name}</td>
                                <td>{user?.pontuacaoGeral}</td>
                                <td>{user?.conclusoes}</td> {/* Nova coluna */}
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
        </div>
    ) : <></>;
    
};

export default Ranking;
