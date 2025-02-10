<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <!-- Componente de Mensagem de Erro -->
      <ErrorMessage :message="errorMessage" @closed="clearError" />
  
      <div class="card p-3 p-md-4 shadow mx-2" style="width: 100%; max-width: 400px">
        <h1 class="card-title text-center mb-3 mb-md-4 fs-3 fs-md-2">PRIS</h1>
        <form @submit.prevent="handleLogin">
          <!-- Campo de E-mail -->
          <div class="mb-3">
            <label for="email" class="form-label">E-mail</label>
            <input
              type="email"
              class="form-control form-control-lg"
              id="email"
              v-model="email"
              placeholder="exemplo@email.com"
              required
            />
          </div>
  
          <!-- Campo de Senha com Olho -->
          <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <div class="position-relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control form-control-lg pe-5"
                id="password"
                v-model="password"
                placeholder="Mínimo 8 caracteres"
                required
              />
              <button
                type="button"
                class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3"
                @click="togglePasswordVisibility"
                aria-label="Mostrar senha"
              >
                <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <!-- Mensagem de Validação de Senha -->
            <div 
              v-if="password.length > 0 && password.length < 8" 
              class="text-danger mt-2 small"
            >
              A senha deve ter pelo menos 8 caracteres.
            </div>
          </div>
  
          <!-- Botão de Login -->
          <button
            type="submit"
            class="btn btn-primary w-100 py-2 py-md-2"
            :disabled="isDisabled"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import ErrorMessage from '../components/ErrorMessage.vue';
  
  export default {
    components: {
      ErrorMessage
    },
    data() {
      return {
        email: "",
        password: "",
        showPassword: false,
        errorMessage: ""
      };
    },
    computed: {
      isDisabled() {
        return !this.email || this.password.length < 8;
      },
    },
    methods: {
      togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
      clearError() {
        this.errorMessage = "";
      },
      async handleLogin() {
        if (this.password.length < 8) return;
  
        try {
          const response = await this.$axios.post(
            "http://localhost:5000/api/auth/login",
            {
              email: this.email,
              password: this.password
            }
          );
  
          this.$store.setToken(response.data.token);
          this.$router.push("/");
        } catch (error: any) {
          if (error.response?.status === 401) {
            this.errorMessage = "Credenciais inválidas";
          } else if (error.response?.status === 400) {
            this.errorMessage = error.response.data.message || "Erro na requisição";
          } else {
            this.errorMessage = "Erro inesperado. Tente novamente mais tarde.";
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos do Botão do Olho */
  .btn-link {
    color: #6c757d !important;
    padding: 0;
    font-size: 1.2rem;
  }
  
  .btn-link:hover {
    color: #007bff !important;
  }
  
  /* Ajustes para Mobile */
  @media (max-width: 768px) {
    .card {
      margin: 0 15px;
      padding: 1.5rem !important;
    }
  
    .form-control-lg {
      font-size: 1rem !important;
      padding: 0.75rem 1rem !important;
    }
  
    .btn {
      font-size: 1rem !important;
      padding: 0.75rem !important;
    }
  
    .card-title {
      font-size: 1.75rem !important;
      margin-bottom: 1.5rem !important;
    }
  
    .btn-link {
      right: 15px !important;
    }
  }
  </style>