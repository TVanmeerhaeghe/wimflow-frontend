<template>
    <div class="edit-estimate">
        <h1>Modifier un Devis</h1>
        <form @submit.prevent="updateEstimate">
            <div class="form-container">
                <div class="form-group">
                    <label>Client</label>
                    <select v-model="estimate.client_id" required>
                        <option v-for="client in clients" :key="client.id" :value="client.id">
                            {{ client.company }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Contact commercial</label>
                    <select v-model="estimate.commercial_contact_id">
                        <option v-for="user in users" :key="user.id" :value="user.id">
                            {{ user.email }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Objet</label>
                    <input type="text" v-model="estimate.object" />
                </div>

                <div class="date-group">
                    <div class="form-group">
                        <label>Date de création</label>
                        <input type="date" v-model="estimate.creation_date" />
                    </div>
                    <div class="form-group">
                        <label>Date de validité</label>
                        <input type="date" v-model="estimate.validity_date" />
                    </div>
                </div>

                <div class="form-group">
                    <label>Marge HT (€)</label>
                    <input type="number" v-model="estimate.margin_ht" />
                </div>

                <div class="form-group">
                    <label>Statut</label>
                    <select v-model="estimate.status">
                        <option>Brouillon</option>
                        <option>Envoyé</option>
                        <option>Expiré</option>
                        <option>Décliné</option>
                        <option>Accepté</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Note Admin</label>
                    <textarea v-model="estimate.admin_note"></textarea>
                </div>
            </div>

            <h2>Tâches</h2>
            <div v-for="(task, index) in tasks" :key="index" class="task-group">
                <div class="task-field designation">
                    <label>Désignation</label>
                    <input type="text" v-model="task.designation" placeholder="Nom de la tâche" required />
                </div>
                <div class="task-field description">
                    <label>Description</label>
                    <textarea type="text" v-model="task.description" placeholder="Description détaillée"></textarea>
                </div>
                <div class="task-field nb-jours">
                    <label>Nb de jours</label>
                    <input type="number" v-model="task.days" placeholder="Quantité de jours" required />
                </div>
                <div class="task-field prix-jour">
                    <label>Prix par jour (€)</label>
                    <input type="number" v-model="task.price_per_day" placeholder="Prix par jour" required />
                </div>
                <div class="task-field tva">
                    <label>TVA (%)</label>
                    <input type="number" v-model="task.tva" placeholder="TVA en %" required />
                </div>
                <button type="button" @click="removeTask(index)" v-if="tasks.length > 1"
                    class="remove-button">🗑️</button>
            </div>

            <div class="button-right">
                <button type="button" @click="addTask" class="add-task-button">+ Ajouter une tâche</button>
            </div>

            <div class="totals">
                <p>Total HT : {{ totalHT.toFixed(2) }} €</p>
                <p>Total TVA : {{ totalTVA.toFixed(2) }} €</p>
                <p>Total TTC : {{ totalTTC.toFixed(2) }} €</p>
            </div>

            <div class="form-group">
                <label>Note Finale</label>
                <textarea v-model="estimate.final_note"></textarea>
            </div>

            <div class="button-right">
                <button type="submit" class="submit-button">Mettre à jour le devis</button>
            </div>
        </form>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
    setup() {
        const estimate = ref({
            id: null,
            client_id: "",
            commercial_contact_id: "",
            creation_date: "",
            validity_date: "",
            margin_ht: 0,
            status: "Brouillon",
            admin_note: "",
            advance_payment: 0,
            discount: 0,
            final_note: "",
        });

        const tasks = ref([]);
        const clients = ref([]);
        const users = ref([]);
        const router = useRouter();
        const route = useRoute();

        const fetchEstimate = async () => {
            const estimateId = route.params.id;
            try {
                const estimateResponse = await fetch(`${process.env.VUE_APP_API_URL}/estimate/${estimateId}`, {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });
                const estimateData = await estimateResponse.json();
                estimate.value = estimateData;
                tasks.value = estimateData.EstimateTasks || [];
            } catch (error) {
                console.error("Erreur lors de la récupération du devis :", error);
            }
        };

        const fetchClients = async () => {
            try {
                const clientsResponse = await fetch(`${process.env.VUE_APP_API_URL}/client`, {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });
                const clientsData = await clientsResponse.json();
                clients.value = clientsData;
            } catch (error) {
                console.error("Erreur lors de la récupération des clients :", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const usersResponse = await fetch(`${process.env.VUE_APP_API_URL}/user`, {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });
                const usersData = await usersResponse.json();
                users.value = usersData;
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            }
        };

        const updateTask = async (task) => {
            const estimateId = route.params.id;
            try {
                await fetch(`${process.env.VUE_APP_API_URL}/estimate-task/${estimateId}/task/${task.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(task),
                });
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la tâche :", error);
            }
        };

        watch(
            tasks,
            (newTasks) => {
                newTasks.forEach((task) => {
                    if (task.id) {
                        updateTask(task);
                    }
                });
            },
            { deep: true }
        );

        const totalHT = computed(() =>
            tasks.value.reduce((total, task) => total + task.days * task.price_per_day, 0)
        );

        const totalTVA = computed(() =>
            tasks.value.reduce((total, task) => {
                const taskTotalHT = task.days * task.price_per_day;
                return total + taskTotalHT * (task.tva / 100);
            }, 0)
        );

        const totalTTC = computed(() => totalHT.value + totalTVA.value);

        const updateEstimate = async () => {
            try {
                const estimateId = estimate.value.id;
                await fetch(`${process.env.VUE_APP_API_URL}/estimate/${estimateId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(estimate.value),
                });

                router.push("/admin/estimate");
            } catch (error) {
                console.error("Erreur lors de la mise à jour du devis :", error);
            }
        };

        onMounted(() => {
            fetchEstimate();
            fetchClients();
            fetchUsers();
        });

        return {
            estimate,
            tasks,
            clients,
            users,
            totalHT,
            totalTVA,
            totalTTC,
            updateEstimate,
        };
    },
};
</script>

<style scoped>
.form-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.date-group {
    display: flex;
    gap: 10px;
    width: 100%;
}

.task-field {
    margin-bottom: 15px;
}

.form-group {
    flex: 1 1 45%;
    margin-bottom: 15px;
}

.task-group {
    display: flex;
    gap: 20px;
    margin-top: 10px;
    align-items: flex-start;
}

.designation {
    width: 25%;
}

.description {
    width: 45%;
}

.nb-jours,
.prix-jour,
.tva {
    width: 8.5%;
}

.remove-button,
.add-task-button,
.submit-button {
    background-color: #80d1cc;
    color: white;
    padding: 10px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 250px;
}

.remove-button {
    margin-top: 35px;
}

.remove-button:hover,
.add-task-button:hover,
.submit-button:hover {
    background-color: #008f82;
    transition: background-color 0.3s ease;
}

.totals {
    text-align: right;
    margin-right: 20px;
    font-weight: bold;
}

.button-right {
    text-align: right;
    margin-top: 20px;
}
</style>
