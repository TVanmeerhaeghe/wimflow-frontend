<template>
    <div class="create-estimate">
        <h1>Créer un Devis</h1>
        <form @submit.prevent="createEstimate">
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
                    <textarea v-model="task.description" placeholder="Description détaillée"></textarea>
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
                <button type="submit" class="submit-button">Créer le devis</button>
            </div>
        </form>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
    setup() {
        const estimate = ref({
            client_id: "",
            commercial_contact_id: "",
            creation_date: new Date().toISOString().slice(0, 10),
            validity_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
                .toISOString()
                .slice(0, 10),
            margin_ht: 0,
            status: "Brouillon",
            admin_note: "",
            final_note: "",
        });
        const tasks = ref([
            {
                designation: "",
                description: "",
                days: 1,
                price_per_day: 0,
                tva: 20.0,
            },
        ]);
        const clients = ref([]);
        const users = ref([]);
        const router = useRouter();
        const toast = useToast();

        const fetchData = async () => {
            try {
                const clientsResponse = await fetch(`${process.env.VUE_APP_API_URL}/client`, {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });
                clients.value = await clientsResponse.json();

                const usersResponse = await fetch(`${process.env.VUE_APP_API_URL}/user`, {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });
                users.value = await usersResponse.json();
            } catch (error) {
                toast.error("Erreur lors du chargement des données.");
            }
        };

        const addTask = () => {
            tasks.value.push({
                designation: "",
                description: "",
                days: 1,
                price_per_day: 0,
                tva: 20.0,
            });
        };

        const removeTask = (index) => {
            tasks.value.splice(index, 1);
        };

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

        const createEstimate = async () => {
            try {
                const estimateResponse = await fetch(`${process.env.VUE_APP_API_URL}/estimate/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(estimate.value),
                });
                const newEstimate = await estimateResponse.json();

                for (const task of tasks.value) {
                    await fetch(`${process.env.VUE_APP_API_URL}/estimate-task/${newEstimate.id}/task`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify(task),
                    });
                }

                await fetch(`${process.env.VUE_APP_API_URL}/estimate/${newEstimate.id}/update-totals`, {
                    method: "PUT",
                    headers: {
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                });

                toast.success("Devis créé avec succès !");
                router.push("/admin/estimate");
            } catch (error) {
                toast.error("Erreur lors de la création du devis.");
            }
        };

        onMounted(fetchData);

        return {
            estimate,
            tasks,
            clients,
            users,
            addTask,
            removeTask,
            createEstimate,
            totalHT,
            totalTVA,
            totalTTC,
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
    gap: 10px;
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
    margin-top: unset;
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
