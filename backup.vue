<template>
    <main>
        <section class="cabecalho">
            <h1>Integracao Prestados</h1>
        </section>
        <section class="main-section">
            <div class="box">
                <div class="box-empresa" v-for="empresa in empresas" :key="empresa.id">
                    <p>
                        {{ empresa.razao_social }}
                    </p>
                </div>
            </div>
        </section>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Empresa {
    _id: {
        $oid: string;
    };
    id: number;
    cliente_id: number;
    razao_social: string;
    cnpj: string;
    cidade: number;
    inscricao_municipal: number;
    api_key_dominio?: string; // Propriedade opcional
}

export default defineComponent({
    data() {
        return {
            empresas: [] as Empresa[], // Tipando o array de empresas
        };
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
                    console.log(this.empresas);
                })
                .catch((error) => {
                    if (error.response?.status === 401) {
                        this.$store.setToken(null);
                    }
                    console.log(error);
                });
        },
    },
});
</script>

<style scoped>
.cabecalho {
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
}
</style>
