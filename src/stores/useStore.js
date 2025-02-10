import { defineStore } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export const useStore = defineStore('main', {
  state: () => {
    const storedToken = localStorage.getItem('token');
    return {
      token: storedToken ? JSON.parse(storedToken) : null,
    };
  },
  actions: {
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', JSON.stringify(token));
      } else {
        localStorage.removeItem('token'); // Limpa o token do localStorage
      }
    },
  },
  getters: {
    userToken(state) {
      return state.token; // Retorna o token diretamente
    },
    isAuthenticated(state) {
      return state.token !== null; // Verifica se o token está presente
    },
  },
  persist: true, // Apenas configure como persistido
});
