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
                <tr v-for="estimate in estimates" :key="estimate.id" @click="showPreview(estimate)">
                    <td><a class="clickable-id">{{ estimate.id }}</a></td>
                    <td>{{ estimate.Client.company }}</td>
                    <td>{{ Number(estimate.total_ht || 0).toFixed(2) }}</td>
                    <td>{{ Number(estimate.total_tva || 0).toFixed(2) }}</td>
                    <td>{{ formatDate(estimate.creation_date) }}</td>
                    <td>{{ formatDate(estimate.validity_date) }}</td>
                    <td>{{ estimate.status }}</td>
                    <td>{{ estimate.object }}</td>
                    <td>{{ Number(estimate.margin_ht || 0).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>

        <button @click="goToCreateEstimate" class="create-estimate-button">Créer un devis</button>

        <EstimatePreview v-if="selectedEstimate" :estimate="selectedEstimate" @close="closePreview"
            @edit="editEstimate" />
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import EstimatePreview from './EstimatePreview.vue';
import formatDate from "@/utils/formatDate";

export default {
    components: { EstimatePreview },
    setup() {
        const estimates = ref([]);
        const selectedEstimate = ref(null);
        const router = useRouter();
        const toast = useToast();

        const fetchEstimates = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/estimate`, {
                    headers: {
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) throw new Error("Erreur lors de la récupération des devis.");

                estimates.value = await response.json();
            } catch (error) {
                toast.error("Erreur lors du chargement des devis.");
                console.error("Fetch error:", error);
            }
        };

        const goToCreateEstimate = () => {
            router.push("/admin/estimate/create");
        };

        const showPreview = (estimate) => {
            selectedEstimate.value = estimate;
        };

        const closePreview = () => {
            selectedEstimate.value = null;
        };

        const editEstimate = (estimate) => {
            router.push(`/admin/estimate/edit/${estimate.id}`);
        };

        onMounted(fetchEstimates);

        return {
            estimates,
            selectedEstimate,
            goToCreateEstimate,
            showPreview,
            closePreview,
            editEstimate,
            formatDate,
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

.clickable-id {
    cursor: pointer;
}

.clickable-id:hover {
    text-decoration: underline;
}
</style>
