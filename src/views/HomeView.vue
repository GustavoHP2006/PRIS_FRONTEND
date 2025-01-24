<template>
    <main>
        <section class="header">
            <h1>Integração Prestados</h1>
        </section>
        <section class="main-section">
            <div class="box">
                <div class="form-group">
                    <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Digite o CNPJ ou Razao Social">
                </div>
                <div class="cabecalho">
                    <div class="razao_social">
                        Razao Social
                    </div>
                    <div class="cnpj">
                        CNPJ
                    </div>
                    <div class="cnpj">
                        ISS
                    </div>
                    <div class="cnpj">
                        PDF
                    </div>
                    <div class="cnpj">
                        XML
                    </div>
                </div>
                <div v-for="empresa in empresas" class="empresas">
                    <div class="razao_social">
                        {{ empresa.razao_social }}
                    </div>
                    <div class="cnpj">
                        {{ empresa.cnpj }}
                    </div>
                    <div class="razao_social">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                    </div>
                    <div class="razao_social">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                    </div>
                    <div class="razao_social">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Empresa {
    _id: string;
    id: number;
    razao_social: string;
    cnpj: string;
    cidade: number;
    inscricao_municipal: number;
    api_key_dominio?: string;
}

export default defineComponent({
    data() {
        return {
            empresas: [] as Empresa[],
            filtro: "",
            checkboxSelecionados: [] as string[],
            selecaoEmpresa: "todas",
            empresasSelecionadas: [] as Empresa[],
        };
    },
    computed: {
        empresasFiltradas() {
            if (this.filtro) {
                return this.empresas.filter(empresa =>
                    empresa.razao_social.toLowerCase().includes(this.filtro.toLowerCase())
                );
            }
            return this.empresas;
        },
    },
    created() {
        this.pegarEmpresas();
    },
    methods: {
        pegarEmpresas() {
            this.$axios
                .get("http://localhost:5000/api/empresas/getEmpresas", {
                    headers: {
                        Authorization: `Bearer ${this.$store.token}`,
                    },
                })
                .then((resp) => {
                    this.empresas = resp.data.empresas;
                })
                .catch((error) => {
                    if (error.response?.status === 401) {
                        this.$store.setToken(null);
                    }
                    console.error(error);
                });
        },
    },
});
</script>

<style scoped>
.header {
    width: 100%;
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.main-section {
    height: 90vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.box {
    border-radius: 18px;
    height: 80%;
    width: 60%;
    background-color: aqua;
    padding: 20px;
    overflow-y: auto;
}
.cabecalho, .empresas {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px; /* Se desejar um pequeno espaçamento entre as linhas */
}

.razao_social, .cnpj {
    flex: 1;
    padding: 5px;
}

</style>
