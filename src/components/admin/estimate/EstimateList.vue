<template>
    <div class="estimate-list">
        <h1>Liste des Devis</h1>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Total HT (€)</th>
                    <th>Total TVA (€)</th>
                    <th>Date de Création</th>
                    <th>Date de Validité</th>
                    <th>Statut</th>
                    <th>Objet</th>
                    <th>Marge HT (€)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="estimate in estimates" :key="estimate.id">
                    <td>{{ estimate.id }}</td>
                    <td>{{ estimate.Client.company }}</td>
                    <td>{{ Number(estimate.total_ht || 0).toFixed(2) }}</td>
                    <td>{{ Number(estimate.total_tva || 0).toFixed(2) }}</td>
                    <td>{{ new Date(estimate.creation_date).toLocaleDateString() }}</td>
                    <td>{{ new Date(estimate.validity_date).toLocaleDateString() }}</td>
                    <td>{{ estimate.status }}</td>
                    <td>{{ estimate.object }}</td>
                    <td>{{ Number(estimate.margin_ht || 0).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>

        <button @click="goToCreateEstimate" class="create-estimate-button">Créer un devis</button>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const estimates = ref([]);
        const router = useRouter();

        const goToCreateEstimate = () => {
            router.push("/admin/estimate/create");
        };

        onMounted(async () => {
            const response = await fetch(`${process.env.VUE_APP_API_URL}/estimate`, {
                headers: {
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
            estimates.value = await response.json();
        });

        return {
            estimates,
            goToCreateEstimate,
        };
    },
};
</script>

<style scoped>
.create-estimate-button {
    background-color: #80d1cc;
    color: white;
    padding: 15px 20px;
    border: none;
    border-radius: 50px;
    font-size: 18px;
    cursor: pointer;
    margin-top: 50px;
    width: 250px;
    position: relative;
    left: 82%;
}

.create-estimate-button:hover {
    background-color: #008f82;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #80d1cc;
    color: white;
}
</style>
