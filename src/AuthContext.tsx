import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from './types';


interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateProfileImage: (profileImageUrl: string) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setAuthenticated(true);
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData: User, token: string) => {
    setAuthenticated(true);
    setUser(userData);
    setToken(token);

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };



  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfileImage = (profileImageUrl: string) => {

    setUser((prevUser) => {
      if (!prevUser) {
        return prevUser;
      }

      const updatedUser = {
        ...prevUser,
        profileImageUrl: profileImageUrl,
        name: prevUser.name || '',
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    });
  };



  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, updateProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
