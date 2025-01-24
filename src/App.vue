<script setup>
import Sidebar from "./components/Sidebar.vue"
import { watchEffect } from 'vue'
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const store = proxy.$store
const router = proxy.$router
// Observa as mudanças na propriedade computada `isAuthenticated` do store
watchEffect(() => {
  if (!store.isAuthenticated && router.currentRoute.value.path != "/login") { // Se não estiver autenticado
    router.push('/login') // Redireciona para a página de login
  }
  if (store.isAuthenticated && router.currentRoute.value.path === "/login") {
    router.push('/')
  }
  console.log(store.isAuthenticated, router.currentRoute.value.path)
})
</script>


<template>
  <div class="app">
    <Sidebar class="sidebar" v-if="router.currentRoute.value.path != '/login'"/>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>


<style lang="scss">
:root {
  --primary: #4ade80;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

body {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex; /* Usa Flexbox para layout */
  height: 100vh; /* Ocupa a altura total da viewport */
}

.sidebar {
  width: var(--sidebar-width); /* Largura ajustável da sidebar */
  background: var(--dark-alt);
  height: 100%; /* Altura total dentro do layout flexbox */
}

.content {
  flex: 1; /* Faz o conteúdo ocupar o restante do espaço disponível */
  padding: 0px;
  background: var(--light);
}
</style>

