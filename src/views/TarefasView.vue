<template>
  <div class="container mt-5">
    <!-- Seção de Filtros com Botão de Criar Task -->
    <div class="row mb-4 align-items-center">
      <div class="col-12 col-md-4 mb-3 mb-md-0">
        <div class="input-group">
          <span class="input-group-text bg-primary text-white">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Pesquisar por ID, tipo ou status"
          />
        </div>
      </div>
      <div class="col-12 col-md-4 mb-3 mb-md-0">
        <div class="input-group">
          <label class="input-group-text bg-primary text-white" for="typeFilter">Tipo</label>
          <select
            id="typeFilter"
            v-model="typeFilter"
            class="form-select"
          >
            <option value="">Todos</option>
            <option value="XML Prestados">XML Prestados</option>
            <option value="PDF Prestados">PDF Prestados</option>
            <option value="ISS Prestados">ISS Prestados</option>
          </select>
        </div>
      </div>
      <div class="col-12 col-md-4 d-flex justify-content-md-end">
        <button @click="showCreateTaskPopup = true" class="btn btn-success">
          <i class="bi bi-plus-circle me-2"></i> Criar Nova Task
        </button>
      </div>
    </div>

    <!-- Lista de Tasks -->
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Lista de Tasks</h5>
      </div>
      <ul class="list-group list-group-flush overflow-auto" style="max-height: 60vh;">
        <li
          v-for="task in filteredTasks"
          :key="task.id"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          @click="selectedTask = task"
          role="button"
        >
          <div>
            <span class="fw-bold">{{ task.id }}</span> - {{ task.tipo }}
            <span class="badge bg-info ms-2">{{ task.status }}</span>
          </div>
          <small class="text-muted">{{ formatDate(task.data_inicio) }}</small>
        </li>
        <li v-if="filteredTasks.length === 0" class="list-group-item text-center text-muted">
          Nenhuma task encontrada
        </li>
      </ul>
    </div>

    <!-- Modal de Detalhes -->
    <TaskPopup
      :task="selectedTask"
      @close="selectedTask = null"
      v-if="selectedTask"
    />

    <!-- Modal de Criar Task -->
    <CreateTaskPopup
      v-if="showCreateTaskPopup"
      @close="showCreateTaskPopup = false; fetchTasks()"
    />
  </div>
</template>

<script>
import TaskPopup from '../components/TaskPopup.vue';
import CreateTaskPopup from '../components/CreateTaskPopup.vue';

export default {
  name: 'TaskView',
  components: { TaskPopup, CreateTaskPopup },
  data() {
    return {
      tasks: [],
      selectedTask: null,
      searchQuery: '',
      typeFilter: '',
      showCreateTaskPopup: false,
      intervalId: null, // Para armazenar o ID do intervalo
    };
  },
  computed: {
    filteredTasks() {
      let result = [...this.tasks];

      // Ordenar por data (mais recente primeiro)
      result.sort((a, b) => new Date(b.data_inicio) - new Date(a.data_inicio));

      // Filtrar por tipo
      if (this.typeFilter) {
        result = result.filter(task => task.tipo === this.typeFilter);
      }

      // Filtrar por pesquisa
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(task =>
          task.id.toString().toLowerCase().includes(query) ||
          task.tipo.toLowerCase().includes(query) ||
          task.status.toLowerCase().includes(query)
        );
      }

      return result;
    },
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await this.$axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${this.$store.token}` },
        });
        this.tasks = response.data.tasks;
      } catch (error) {
        console.error('Erro ao buscar tasks:', error);
      }
    },
    formatDate(dateString) {
      if (!dateString || isNaN(new Date(dateString))) {
        return 'Data inválida';
      }
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Intl.DateTimeFormat('pt-BR', options).format(new Date(dateString));
    },
    startFetchingTasks() {
      // Inicia a verificação a cada 20 segundos
      this.intervalId = setInterval(() => {
        this.fetchTasks();
      }, 20000); // 20 segundos em milissegundos
    },
    stopFetchingTasks() {
      // Para a verificação ao destruir o componente
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    },
  },
  mounted() {
    this.fetchTasks(); // Carrega as tasks imediatamente ao montar
    this.startFetchingTasks(); // Inicia o intervalo de atualização
  },
  beforeDestroy() {
    this.stopFetchingTasks(); // Para o intervalo quando o componente é destruído
  },
};
</script>

<style scoped>
.list-group-item:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

/* Estilo para o botão de criar task */
.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

/* Ajuste para alinhamento em telas menores */
@media (max-width: 767px) {
  .btn-success {
    width: 100%;
    margin-top: 10px;
  }
}
</style>