import create from 'zustand';

interface User {
    id: number;
    name: string;
    email: string;
    pontuacao_geral: number;
    tipo_usuario: string;
    conquistas: number;
}

interface StoreState {
    users: User[];
    currentUserPosition: number | null;
    setUsers: (users: User[]) => void;
    setCurrentUserPosition: (position: number | null) => void;
}

export const useStore = create<StoreState>((set) => ({
    users: [],
    currentUserPosition: null,
    setUsers: (users) => set({ users }),
    setCurrentUserPosition: (position) => set({ currentUserPosition: position }),
}));
