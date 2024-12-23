<template>
    <div class="estimate-list">
        <h1>Devis du Projet</h1>

        <table v-if="estimates.length > 0">
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
                    <td>{{ estimate.Client?.company }}</td>
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
        <p v-else>Aucun devis trouvé pour ce projet.</p>

        <button @click="goToCreateEstimate" class="create-estimate-button">Créer un devis</button>

        <EstimatePreview v-if="selectedEstimate" :estimate="selectedEstimate" @close="closePreview"
            @edit="editEstimate" />
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import EstimatePreview from "../../estimate/EstimatePreview.vue";

export default {
    components: { EstimatePreview },
    setup() {
        const estimates = ref([]);
        const selectedEstimate = ref(null);
        const router = useRouter();
        const route = useRoute();
        const toast = useToast();

        const projectId = route.params.id;

        const goToCreateEstimate = () => {
            router.push(`/admin/estimate/create?projectId=${projectId}`);
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

        onMounted(async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/estimate/project/${projectId}`, {
                    headers: {
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des devis.");
                }

                estimates.value = await response.json();
            } catch (error) {
                toast.error("Impossible de charger les devis. Veuillez réessayer.");
                console.error(error);
            }
        });

        return {
            estimates,
            selectedEstimate,
            goToCreateEstimate,
            showPreview,
            closePreview,
            editEstimate,
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
