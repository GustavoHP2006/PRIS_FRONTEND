<template>
  <div class="modal fade show" tabindex="-1" style="display: block;" @click.self="closeModal">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content shadow-lg">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">Detalhes da Task - {{ task.id }}</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Abas -->
          <ul class="nav nav-tabs mb-3" id="taskTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="details-tab"
                data-bs-toggle="tab"
                data-bs-target="#details"
                type="button"
                role="tab"
                aria-controls="details"
                aria-selected="true"
              >
                Detalhes
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="logs-tab"
                data-bs-toggle="tab"
                data-bs-target="#logs"
                type="button"
                role="tab"
                aria-controls="logs"
                aria-selected="false"
              >
                Logs
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="companies-tab"
                data-bs-toggle="tab"
                data-bs-target="#companies"
                type="button"
                role="tab"
                aria-controls="companies"
                aria-selected="false"
              >
                Empresas
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="files-tab"
                data-bs-toggle="tab"
                data-bs-target="#files"
                type="button"
                role="tab"
                aria-controls="files"
                aria-selected="false"
              >
                Arquivos
              </button>
            </li>
          </ul>

          <!-- Conteúdo das Abas -->
          <div class="tab-content" id="taskTabsContent">
            <!-- Aba de Detalhes -->
            <div class="tab-pane fade show active" id="details" role="tabpanel" aria-labelledby="details-tab">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between">
                  <strong>ID:</strong> <span>{{ task.id }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <strong>Tipo:</strong> <span>{{ task.tipo }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <strong>Status:</strong>
                  <span :class="`badge ${statusClass(task.status)}`">{{ task.status }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <strong>Data de Início:</strong> <span>{{ formatDate(task.data_inicio) }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <strong>Data de Fim:</strong>
                  <span>{{ task.data_final ? formatDate(task.data_final) : 'N/A' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <strong>Período de Robotização:</strong>
                  <span>{{ formatDate(task.periodo_robotizacao) }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <strong>Cliente ID:</strong> <span>{{ task.cliente_id }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <strong>Empresas:</strong> <span>{{ task.empresas.join(', ') }}</span>
                </li>
              </ul>
            </div>

            <!-- Aba de Logs -->
            <div class="tab-pane fade" id="logs" role="tabpanel" aria-labelledby="logs-tab">
              <div v-if="logsLoading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Carregando...</span>
                </div>
              </div>
              <div v-else-if="logsError" class="alert alert-danger">
                {{ logsError }}
              </div>
              <div v-else>
                <ul class="list-group">
                  <li
                    v-for="log in logs"
                    :key="log.id"
                    class="list-group-item"
                  >
                    <strong>{{ formatDate(log.data) }}:</strong> {{ log.mensagem }}
                    <span
                      class="badge"
                      :class="{'bg-success': log.tipo === 'Info', 'bg-danger': log.tipo === 'Erro'}"
                    >
                      {{ log.tipo }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Aba de Empresas -->
            <div class="tab-pane fade" id="companies" role="tabpanel" aria-labelledby="companies-tab">
              <div v-if="companiesLoading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Carregando...</span>
                </div>
              </div>
              <div v-else-if="companiesError" class="alert alert-danger">
                {{ companiesError }}
              </div>
              <div v-else>
                <ul class="list-group">
                  <li v-for="empresa in empresas" :key="empresa.id" class="list-group-item">
                    <strong>{{ empresa.razao_social }}</strong> - {{ empresa.cnpj }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Aba de Arquivos -->
            <div class="tab-pane fade" id="files" role="tabpanel" aria-labelledby="files-tab">
              <div v-if="filesLoading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Carregando...</span>
                </div>
              </div>
              <div v-else-if="filesError" class="alert alert-danger">
                {{ filesError }}
              </div>
              <div v-else>
                <ul class="list-group">
                  <li v-for="arquivo in arquivos" :key="arquivo.id" class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ arquivo.tipo }}</strong> - {{ formatDate(arquivo.data) }}
                    </div>
                    <button class="btn btn-primary btn-sm" @click="downloadArquivo(arquivo.id)">
                      Download
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskPopup',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      logs: [],
      logsLoading: false,
      logsError: null,
      empresas: [],
      companiesLoading: false,
      companiesError: null,
      arquivos: [],
      filesLoading: false,
      filesError: null,
    };
  },
  methods: {
    // Formatar data
    formatDate(dateString) {
      if (!dateString || isNaN(new Date(dateString))) return 'N/A';
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Intl.DateTimeFormat('pt-BR', options).format(new Date(dateString));
    },
    // Classe do badge baseada no status
    statusClass(status) {
      switch (status.toLowerCase()) {
        case 'completo':
          return 'bg-success';
        case 'pendente':
          return 'bg-warning';
        case 'erro':
          return 'bg-danger';
        default:
          return 'bg-info';
      }
    },
    // Buscar logs da tarefa
    async fetchLogs() {
      this.logsLoading = true;
      this.logsError = null;
      try {
        const response = await this.$axios.get(`http://localhost:5000/api/tasks/logs/${this.task.id}`, {
          headers: { Authorization: `Bearer ${this.$store.token}` },
        });
        this.logs = response.data.logs;
        console.log('Logs carregados:', this.logs);
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
        this.logsError = 'Erro ao carregar logs.';
      } finally {
        this.logsLoading = false;
      }
    },
    // Buscar empresas da tarefa
    async fetchCompanies() {
      this.companiesLoading = true;
      this.companiesError = null;
      try {
        const empresaIds = this.task.empresas.join(',');
        const url = this.task.empresas.length === 1
          ? `http://localhost:5000/api/empresas/getEmpresas/${this.task.empresas[0]}`
          : `http://localhost:5000/api/empresas/getEmpresas?ids=${empresaIds}`;
        const response = await this.$axios.get(url, {
          headers: { Authorization: `Bearer ${this.$store.token}` },
        });
        this.empresas = response.data.empresas;
        console.log('Empresas carregadas:', this.empresas);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        this.companiesError = 'Erro ao carregar empresas.';
      } finally {
        this.companiesLoading = false;
      }
    },
    // Buscar arquivos da tarefa
    async fetchFiles() {
      this.filesLoading = true;
      this.filesError = null;
      try {
        console.log(`http://localhost:5000/api/tasks/${this.task.id}/arquivos`)
        const response = await this.$axios.get(`http://localhost:5000/api/tasks/${this.task.id}/arquivos`, {
          headers: { Authorization: `Bearer ${this.$store.token}` },
        });
        this.arquivos = response.data.arquivos;
        console.log('Arquivos carregados:', this.arquivos);
      } catch (error) {
        console.error('Erro ao buscar arquivos:', error);
        this.filesError = 'Erro ao carregar arquivos.';
      } finally {
        this.filesLoading = false;
      }
    },
    // Fazer download de um arquivo
    async downloadArquivo(arquivoId) {
  try {
    const response = await this.$axios.get(
      `http://localhost:5000/api/arquivos/${arquivoId}/download`,
      {
        headers: { Authorization: `Bearer ${this.$store.token}` },
        responseType: 'blob', // Garante que recebemos como binário
      }
    );

    // Extrair o nome do arquivo do header Content-Disposition
    const contentDisposition = response.headers['content-disposition'] || '';
    let filename = 'downloaded_file';
    if (contentDisposition && contentDisposition.includes('filename=')) {
      filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
    }

    // Obter o Content-Type do header
    const contentType = response.headers['content-type'] || 'application/octet-stream';

    // Criar um Blob com o tipo MIME correto
    const blob = new Blob([response.data], { type: contentType });

    // Criar um link temporário para baixar o arquivo
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // Define o nome do arquivo para download
    document.body.appendChild(link);
    link.click();

    // Limpar após o download
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log(`Arquivo ${filename} baixado com sucesso`);
  } catch (error) {
    console.error('Erro ao fazer download do arquivo:', error);
    alert('Erro ao fazer download do arquivo.');
  }
},
    // Fechar modal
    closeModal() {
      this.$emit('close');
    },
  },
  mounted() {
    console.log('Task ID:', this.task.id);
    console.log('Empresas:', this.task.empresas);

    // Adiciona listeners para as abas
    const tabs = document.querySelectorAll('#taskTabs .nav-link');
    tabs.forEach(tab => {
      tab.addEventListener('shown.bs.tab', (event) => {
        const target = event.target.getAttribute('aria-controls');
        if (target === 'logs') {
          this.fetchLogs();
        } else if (target === 'companies') {
          this.fetchCompanies();
        } else if (target === 'files') {
          this.fetchFiles();
        }
      });
    });
  },
};
</script>

<style scoped>
.modal-content {
  border-radius: 10px;
}

.list-group-item {
  border-left: 0;
  border-right: 0;
  margin-bottom: 5px; /* Espaçamento entre os logs */
}

.badge {
  margin-left: 10px; /* Espaçamento entre a mensagem e o badge */
  color: white; /* Texto branco para o badge */
}

.bg-success {
  background-color: #28a745; /* Verde para "Info" */
}

.bg-danger {
  background-color: #dc3545; /* Vermelho para "Erro" */
}

.nav-tabs .nav-link {
  cursor: pointer;
}
</style>