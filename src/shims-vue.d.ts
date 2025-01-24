declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

import axios from 'axios'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: typeof axios
  }
}

import { Pinia } from 'pinia'
import { useStore } from './stores/useStore' // Importe seu store

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: ReturnType<typeof useStore>  // Definindo o tipo do store
  }
}

import type { Router } from 'vue-router'

// Declaração global para o Vue
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $router: Router
    }
}