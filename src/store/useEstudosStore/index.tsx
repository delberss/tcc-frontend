// src/store/useEstudosStore.ts
import create from 'zustand';

interface Estudo {
  id: number;
  nome: string;
  linguagens: string[];
}

interface PreferenciaEstudo {
  id: number;
  nome: string;
  linguagens: string[];
}

interface EstudosState {
  estudos: Estudo[];
  preferenciaEstudo: PreferenciaEstudo[] | null;
  fetchEstudos: () => Promise<void>;
  fetchPreferenciaEstudo: (userId: number) => Promise<void>;
  adicionarEstudo: (novoEstudo: Estudo) => void;
}

export const useEstudosStore = create<EstudosState>((set) => ({
  estudos: [],
  preferenciaEstudo: null,
  fetchEstudos: async () => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/estudos`);
      const data = await response.json();
      set({ estudos: data });
    } catch (error) {
      console.error('Erro ao buscar tipos de estudo:', error);
    }
  },
  fetchPreferenciaEstudo: async (userId: number) => {
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/user-preference-study/${userId}`);
      const data = await response.json();
      if (data.success) {
        set({ preferenciaEstudo: data.preferenciaEstudos });
      } else {
        console.error('Erro ao obter preferenciaEstudo:', data.message);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  },
  adicionarEstudo: (novoEstudo: Estudo) => {
    set((state) => ({ estudos: [...state.estudos, novoEstudo] }));
  },
}));
