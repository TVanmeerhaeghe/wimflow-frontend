<template>
    <div>
        <div v-if="loading">Chargement des tâches...</div>
        <div v-if="error">{{ error }}</div>
        <div class="tasks-list" v-if="tasks && tasks.length > 0">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Désignation</th>
                        <th>Description</th>
                        <th>Qté.</th>
                        <th>Prix unitaire (€)</th>
                        <th>Montant HT (€)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(task, index) in tasks" :key="task.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ task.designation }}</td>
                        <td>{{ task.description }}</td>
                        <td>{{ Number(task.days) || 0 }}</td>
                        <td>{{ parseFloat(task.price_per_day).toFixed(2) || '0.00' }}</td>
                        <td>{{ (Number(task.days) * parseFloat(task.price_per_day)).toFixed(2) || '0.00' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="!loading && !error">
            <p>Aucune tâche disponible.</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

export default {
    name: 'TaskList',
    props: {
        estimateId: {
            type: String,
            required: true,
        },
    },
    setup(props, { emit }) {
        const tasks = ref([]);
        const loading = ref(true);
        const error = ref(null);

        const fetchTasks = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/estimate-task/${props.estimateId}/tasks`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    tasks.value = data;
                    calculateTotals();
                } else {
                    throw new Error(data.message || 'Erreur lors de la récupération des tâches.');
                }
            } catch (err) {
                error.value = err.message;
            } finally {
                loading.value = false;
            }
        };

        const calculateTotals = () => {
            const totalHT = tasks.value.reduce((acc, task) => {
                const price = parseFloat(task.price_per_day) || 0;
                const days = Number(task.days) || 0;
                return acc + (days * price);
            }, 0);

            const totalTVA = totalHT * 0.2;

            emit('updateTotals', { totalHT, totalTVA });
        };

        onMounted(fetchTasks);

        watch(tasks, calculateTotals, { deep: true });

        return {
            tasks,
            loading,
            error,
        };
    },
};
</script>

<style scoped>
.tasks-list table {
    width: 100%;
    border-collapse: collapse;
}

.tasks-list th,
.tasks-list td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.tasks-list th {
    background-color: #80d1cc;
}
</style>
