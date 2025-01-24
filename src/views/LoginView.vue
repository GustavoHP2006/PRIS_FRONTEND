<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Digite seu email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <button type="submit" :disabled="isDisabled">Entrar</button>
      </form>
    </div>
  </template>
  
<script lang="ts">

  export default {
    data() {
      return {
        email: "",
        password: "",
      };
    },
    computed: {
      isDisabled() {
        return !this.email || !this.password;
      },
    },
    methods: {
      async handleLogin() {
        if (this.email && this.password) {
            let body = {
                email: this.email,
                password: this.password
            }
            this.$axios.post("http://localhost:5000/api/auth/login", body)
                .then((response) => {
                    this.$store.setToken(response.data.token)
                    this.$router.push("/")
                })
                .catch((error) => {
                    if (error.status == 401) {
                        alert("Nao autorizado")
                    }
                    if (error.status == 400) {
                        alert(error.response.data.message)
                    }
                }
            )
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Centraliza a tela de login no meio da página */
  .login-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    max-width: 400px;
    width: 30vw;
    margin: 0 auto;
    padding: 20px;
    background: var(--light);
    border: 1px solid var(--grey);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Título centralizado */
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: var(--dark);
  }
  
  /* Estilo dos grupos de formulário */
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    color: var(--grey);
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--grey);
    border-radius: 5px;
    background: var(--light);
    color: var(--dark);
  }
  
  /* Botão estilizado */
  button {
    width: 100%;
    padding: 10px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: var(--primary-alt);
  }
  
  button:disabled {
    background-color: var(--grey);
    cursor: not-allowed;
  }
  </style>
  