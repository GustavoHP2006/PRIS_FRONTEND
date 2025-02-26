<template>
    <div class="modal fade show" tabindex="-1" style="display: block;" @click.self="closeModal">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-gradient-primary text-white">
            <h5 class="modal-title">Criar Nova Task</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body bg-light">
            <form @submit.prevent="createTask">
              <!-- Campo de Busca de Empresas -->
              <div class="mb-4">
                <label for="searchEmpresas" class="form-label text-dark">Procurar Empresas</label>
                <div class="input-group">
                  <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    id="searchEmpresas"
                    v-model="searchQuery"
                    class="form-control custom-input border-start-0"
                    placeholder="Digite para buscar empresas..."
                  />
                </div>
              </div>
  
              <!-- Seleção de Empresas com Checkboxes -->
              <div class="mb-4">
                <label class="form-label text-dark">Empresas</label>
                <div class="checkbox-container">
                  <div v-if="filteredEmpresas.length === 0" class="text-muted text-center py-3">
                    Nenhuma empresa encontrada
                  </div>
                  <div v-else class="checkbox-list">
                    <div
                      v-for="empresa in filteredEmpresas"
                      :key="empresa.id"
                      class="form-check checkbox-item"
                    >
                      <input
                        type="checkbox"
                        :id="'empresa-' + empresa.id"
                        :value="empresa.id"
                        v-model="form.empresas"
                        class="form-check-input"
                      />
                      <label :for="'empresa-' + empresa.id" class="form-check-label">
                        {{ empresa.razao_social }} - {{ empresa.cnpj }}
                      </label>
                    </div>
                  </div>
                </div>
                <small class="form-text text-muted">Selecione pelo menos uma empresa</small>
              </div>
  
              <!-- Tipo de Task (obrigatório) -->
              <div class="mb-4">
                <label for="tipo" class="form-label text-dark">Tipo</label>
                <select
                  id="tipo"
                  v-model="form.tipo"
                  class="form-select custom-select"
                  :class="{ 'is-invalid': !isTipoValid }"
                  required
                  @change="validateTipo"
                >
                  <option value="" disabled>Selecione o tipo</option>
                  <option value="XML Prestados">XML Prestados</option>
                  <option value="PDF Prestados">PDF Prestados</option>
                  <option value="ISS Prestados">ISS Prestados</option>
                </select>
                <!-- Removido o aviso "Selecione um tipo de task." -->
              </div>
  
              <!-- Período (MM/YYYY com validação e obrigatoriedade) -->
              <div class="mb-4">
                <label for="periodo" class="form-label text-dark">Período</label>
                <input
                  type="text"
                  id="periodo"
                  v-model="form.periodo"
                  class="form-control custom-input"
                  :class="{ 'is-invalid': (!isPeriodoValid || !isPeriodoComplete) && form.periodo }"
                  placeholder="MM/YYYY"
                  required
                  v-mask="'##/####'"
                  @input="validatePeriodo"
                />
                <div v-if="(!isPeriodoValid || !isPeriodoComplete) && form.periodo" class="invalid-feedback">
                  {{ periodoErrorMessage || 'Digite um período completo (MM/YYYY).' }}
                </div>
                <!-- Removido o aviso "O período é obrigatório." -->
              </div>
  
              <!-- Mensagem de Erro ou Sucesso -->
              <div v-if="errorMessage" class="alert alert-danger alert-custom" role="alert">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="alert alert-success alert-custom" role="alert">
                {{ successMessage }}
              </div>
            </form>
          </div>
          <div class="modal-footer bg-light">
            <button class="btn btn-outline-secondary btn-custom" @click="closeModal">Cancelar</button>
            <button
              class="btn btn-primary btn-custom"
              @click="createTask"
              :disabled="loading || form.empresas.length === 0 || !isPeriodoValid || !isTipoValid || !isPeriodoComplete"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ loading ? 'Criando...' : 'Criar Task' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mask } from 'vue-the-mask';
  
  export default {
    name: 'CreateTaskPopup',
    directives: {
      mask
    },
    data() {
      return {
        form: {
          empresas: [],
          tipo: '',
          periodo: '',
        },
        empresas: [],
        searchQuery: '',
        loading: false,
        errorMessage: '',
        successMessage: '',
        isPeriodoValid: true,
        isPeriodoComplete: false, // Nova propriedade para verificar se o período está completo
        periodoErrorMessage: '',
        isTipoValid: false,
      };
    },
    computed: {
      filteredEmpresas() {
        if (!this.searchQuery) return this.empresas;
        const query = this.searchQuery.toLowerCase();
        return this.empresas.filter(
          empresa =>
            empresa.razao_social.toLowerCase().includes(query) ||
            empresa.cnpj.toLowerCase().includes(query)
        );
      },
    },
    methods: {
      async fetchEmpresas() {
        try {
          const response = await this.$axios.get('http://localhost:5000/api/empresas/getEmpresas', {
            headers: { Authorization: `Bearer ${this.$store.token}` },
          });
          this.empresas = response.data.empresas;
        } catch (error) {
          console.error('Erro ao buscar empresas:', error);
          this.errorMessage = 'Erro ao carregar lista de empresas.';
        }
      },
      async createTask() {
        if (!this.isPeriodoValid || !this.isTipoValid || !this.isPeriodoComplete) return;
  
        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';
  
        try {
          const response = await this.$axios.post(
            'http://localhost:5000/api/tasks',
            {
              empresas: this.form.empresas,
              tipo: this.form.tipo,
              periodo: "01/"+this.form.periodo,
            },
            {
              headers: { Authorization: `Bearer ${this.$store.token}` },
            }
          );
          this.successMessage = 'Task criada com sucesso!';
          this.resetForm();
          setTimeout(() => this.closeModal(), 2000);
        } catch (error) {
          console.error('Erro ao criar task:', error);
          this.errorMessage = error.response?.data?.message || 'Erro ao criar task.';
        } finally {
          this.loading = false;
        }
      },
      validatePeriodo() {
        // Verifica se o período está completo (7 caracteres: MM/YYYY)
        this.isPeriodoComplete = this.form.periodo && this.form.periodo.length === 7;
  
        if (!this.isPeriodoComplete) {
          this.isPeriodoValid = true; // Não valida regras adicionais se incompleto
          this.periodoErrorMessage = '';
          return;
        }
  
        const [month, year] = this.form.periodo.split('/');
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
  
        // Data atual (25/02/2025)
        const currentDate = new Date('2025-02-25');
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
  
        // Validação do mês (1-12)
        if (monthNum < 1 || monthNum > 12) {
          this.isPeriodoValid = false;
          this.periodoErrorMessage = 'O mês deve estar entre 01 e 12.';
          return;
        }
  
        // Validação do ano (mínimo 2024)
        if (yearNum < 2024) {
          this.isPeriodoValid = false;
          this.periodoErrorMessage = 'O ano não pode ser inferior a 2024.';
          return;
        }
  
        // Validação da data (não pode ser maior que o mês/ano atual)
        if (yearNum > currentYear || (yearNum === currentYear && monthNum > currentMonth)) {
          this.isPeriodoValid = false;
          this.periodoErrorMessage = `O período não pode ser posterior a ${currentMonth.toString().padStart(2, '0')}/${currentYear}.`;
          return;
        }
  
        this.isPeriodoValid = true;
        this.periodoErrorMessage = '';
      },
      validateTipo() {
        this.isTipoValid = !!this.form.tipo;
      },
      resetForm() {
        this.form.empresas = [];
        this.form.tipo = '';
        this.form.periodo = '';
        this.searchQuery = '';
        this.isPeriodoValid = true;
        this.isPeriodoComplete = false;
        this.periodoErrorMessage = '';
        this.isTipoValid = false;
      },
      closeModal() {
        this.$emit('close');
      },
    },
    mounted() {
      this.fetchEmpresas();
    },
  };
  </script>
  
  <style scoped>
  /* Gradiente no header */
  .bg-gradient-primary {
    background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
  }
  
  /* Estilo geral do modal */
  .modal-content {
    border-radius: 15px;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  /* Fundo suave no body e footer */
  .modal-body,
  .modal-footer {
    background-color: #f8f9fa;
    border-radius: 0 0 15px 15px;
  }
  
  /* Estilo dos labels */
  .form-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  
  /* Estilo dos inputs e selects */
  .custom-select,
  .custom-input {
    border-radius: 8px;
    border: 1px solid #ced4da;
    padding: 10px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .custom-select:focus,
  .custom-input:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
  
  /* Estilo do campo de busca */
  .input-group-text {
    border-radius: 8px 0 0 8px;
    background-color: #fff;
  }
  
  .custom-input {
    border-radius: 0 8px 8px 0;
  }
  
  /* Estilo da lista de checkboxes */
  .checkbox-container {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ced4da;
    border-radius: 8px;
    background-color: #fff;
    padding: 25px;
    margin-bottom: 15px;
    scrollbar-width: thin;
    scrollbar-color: #ced4da #fff;
  }
  
  .checkbox-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .checkbox-container::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 8px;
  }
  
  .checkbox-container::-webkit-scrollbar-thumb {
    background: #ced4da;
    border-radius: 8px;
  }
  
  .checkbox-container::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }
  
  /* Ajuste da lista de checkboxes */
  .checkbox-list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  /* Ajuste de cada item de checkbox */
  .checkbox-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    transition: background-color 0.2s ease;
    min-height: 40px;
  }
  
  .checkbox-item:hover {
    background-color: #f1f3f5;
  }
  
  .form-check-input {
    margin: 0 15px 0 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
  }
  
  .form-check-label {
    cursor: pointer;
    color: #495057;
    flex-grow: 1;
    word-break: break-word;
    line-height: 1.4;
  }
  
  .form-check-input:checked + .form-check-label {
    font-weight: 500;
    color: #007bff;
  }
  
  /* Estilo para campo inválido */
  .is-invalid {
    border-color: #dc3545;
  }
  
  .invalid-feedback {
    display: block;
    color: #dc3545;
    font-size: 0.875em;
    margin-top: 0.25rem;
  }
  
  /* Estilo dos alerts */
  .alert-custom {
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    margin-top: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  /* Estilo dos botões */
  .btn-custom {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .btn-outline-secondary {
    border-color: #6c757d;
    color: #6c757d;
  }
  
  .btn-outline-secondary:hover {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-primary {
    background-color: #007bff;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .btn-primary:disabled {
    background-color: #a0c4ff;
    cursor: not-allowed;
  }
  
  /* Aumentar espaçamento interno */
  .mb-4 {
    margin-bottom: 1.5rem !important;
  }
  
  /* Efeito de hover no modal */
  .modal-dialog {
    transition: transform 0.2s ease-out;
  }
  
  .modal-dialog:hover {
    transform: translateY(-5px);
  }
  </style>