import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext'; // Importe o contexto de autenticação
import './index.css';

interface User {
    id: number;
    name: string;
    email: string;
    pontuacao_geral: number;
}

const Ranking: React.FC = () => {
    const { token, user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [currentUserPosition, setCurrentUserPosition] = useState<number | null>(null);
    const visibleUsers = users.slice(0, 20);


    useEffect(() => {
        if(token !== null){
            const fetchUsers = async () => {
                try {
                    const response = await fetch(`http://localhost:4000/users`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }
    
                    const data: User[] = await response.json();
                    const sortedUsers = data.sort((a, b) => b.pontuacao_geral - a.pontuacao_geral);
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

    const medals = [
        <span key="gold" className="gold-medal icon-medal">🥇</span>,
        <span key="silver" className="silver-medal icon-medal">🥈</span>,
        <span key="bronze" className="bronze-medal icon-medal">🥉</span>,
    ];

    return (
        <div className="table-container">
            <h2 className="ranking">Melhores classificados</h2>
            <table>
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>Pontuação</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleUsers.map((user, index) => (
                        <tr key={index} className={`table-row ${index === (currentUserPosition ?? 0) - 1 ? 'current-user-row' : ''} ${index < 3 ? 'highlighted-row' : ''}`}>
                        <td>
                                {index < 3 ? (
                                    <span className="medal-icon">{medals[index]}</span>
                                ) : (
                                    <span className='posicao'>{index + 1}</span>
                                )}
                            </td>
                            <td className={index < 3 ? 'top-users' : ''}>{user.name}</td>
                            <td className={index < 3 ? 'top-users' : ''}>{user.pontuacao_geral}</td>
                        </tr>
                    ))}
                    {currentUserPosition && currentUserPosition > 20 && (
                        // Mostra a posição do usuário atual se estiver além dos 20 primeiros
                        <>
                            <tr className={`table-row ellipsis-row`}>
                                <td colSpan={3}><span className='ellipsis'>...</span></td>
                            </tr>
                            <tr className={`table-row current-user-row`}>
                                <td><span className='posicao'>{currentUserPosition}</span></td>
                                <td>{user?.name}</td>
                                <td>{user?.pontuacaoGeral}</td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Ranking;
