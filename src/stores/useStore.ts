import { defineStore } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

interface State {
  token: string | null; // Atualize aqui para refletir a possibilidade de token ser null
}

export const useStore = defineStore('main', {
  state: (): State => {
    const storedToken = localStorage.getItem('token');
    return {
      token: storedToken ? JSON.parse(storedToken) : null,
    };
  },
  actions: {
    setToken(token: string | null) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', JSON.stringify(token));
      } else {
        localStorage.removeItem('token'); // Limpa o token do localStorage
      }
    },
  },
  getters: {
    userToken(state): string | null {
      return state.token; // Retorna o token diretamente
    },
    isAuthenticated(state): boolean {
      return state.token !== null; // Verifica se o token está presente
    },
  },
  persist: true, // Apenas configure como persistido
});
