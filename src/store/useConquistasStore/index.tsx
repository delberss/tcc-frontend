// src/store/useConquistasStore.ts
import create from 'zustand';

interface Conquista {
    id: number;
    nome_conquista: string;
    descricao: string;
}

interface ConquistasState {
    conquistasUsuario: Conquista[];
    todasConquistas: Conquista[];
    fetchConquistasUsuario: (userId: number) => Promise<void>;
    fetchTodasConquistas: () => Promise<void>;
}

export const useConquistasStore = create<ConquistasState>((set) => ({
    conquistasUsuario: [],
    todasConquistas: [],
    fetchConquistasUsuario: async (userId: number) => {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/conquistas-usuario/${userId}`);
        const data = await response.json();
        if (response.ok) {
            set({ conquistasUsuario: data.conquistasUsuario });
        } else {
            console.error('Erro na requisição de conquistas do usuário:', data.message);
        }
    },
    fetchTodasConquistas: async () => {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/conquistas`);
        const data = await response.json();
        if (response.ok) {
            set({ todasConquistas: data.conquistas });
        } else {
            console.error('Erro na requisição de todas as conquistas:', data.message);
        }
    }
}));
