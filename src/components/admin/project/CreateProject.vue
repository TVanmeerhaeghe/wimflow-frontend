<template>
    <div class="create-project">
        <h1>Créer un projet</h1>
        <form @submit.prevent="handleSubmit">
            <div class="form-row">
                <div class="form-group">
                    <label for="name">Nom du projet</label>
                    <input type="text" id="name" v-model="name" required />
                </div>
                <div class="form-group">
                    <label for="billing_type">Type de facturation</label>
                    <select id="billing_type" v-model="billing_type" required>
                        <option value="forfait">Forfait</option>
                        <option value="horaire">Horaire</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="client">Client</label>
                    <select id="client" v-model="client_id" required>
                        <option v-for="client in clients" :key="client.id" :value="client.id">
                            {{ client.company }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="members">Collaborateurs (Admins)</label>
                    <div class="member-selector">
                        <select id="members" v-model="selectedMember" class="member-dropdown">
                            <option v-for="admin in admins" :key="admin.id" :value="admin.id">
                                {{ admin.username }}
                            </option>
                        </select>
                        <button type="button" @click="addMember">Ajouter</button>
                    </div>
                    <ul class="member-list">
                        <li v-for="member in selectedMembers" :key="member">
                            {{ getUsername(member) }}
                            <button type="button" @click="removeMember(member)">X</button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="status">Statut</label>
                    <select id="status" v-model="status" required>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                        <option value="En attente">En attente</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="total_cost">Coût total</label>
                    <input type="number" id="total_cost" v-model="total_cost" required />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="estimated_hours">Heures estimées</label>
                    <input type="number" id="estimated_hours" v-model="estimated_hours" />
                </div>
                <div class="form-group">
                    <label for="start_date">Date de début</label>
                    <input type="date" id="start_date" v-model="start_date" required />
                </div>
                <div class="form-group">
                    <label for="end_date">Date de fin</label>
                    <input type="date" id="end_date" v-model="end_date" />
                </div>
            </div>

            <div class="form-group full-width">
                <label for="description">Description</label>
                <textarea id="description" v-model="description"></textarea>
            </div>

            <button type="submit">Créer</button>
        </form>
    </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
    setup() {
        const name = ref("");
        const billing_type = ref("forfait");
        const status = ref("En cours");
        const total_cost = ref(0);
        const estimated_hours = ref(null);
        const start_date = ref("");
        const end_date = ref(null);
        const description = ref("");
        const client_id = ref(null);
        const clients = ref([]);
        const admins = ref([]);
        const selectedMember = ref(null);
        const selectedMembers = ref([]);
        const router = useRouter();
        const toast = useToast();

        const fetchClients = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/client`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                clients.value = await response.json();
            } catch (error) {
                console.error("Erreur lors de la récupération des clients :", error);
                toast.error("Erreur lors de la récupération des clients.");
            }
        };

        const fetchAdmins = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/user`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                const allUsers = await response.json();
                admins.value = allUsers.filter(user => user.role === "admin");
            } catch (error) {
                console.error("Erreur lors de la récupération des admins :", error);
                toast.error("Erreur lors de la récupération des administrateurs.");
            }
        };

        onMounted(() => {
            fetchClients();
            fetchAdmins();
        });

        const addMember = () => {
            if (selectedMember.value && !selectedMembers.value.includes(selectedMember.value)) {
                selectedMembers.value.push(selectedMember.value);
                selectedMember.value = null;
            }
        };

        const removeMember = (memberId) => {
            selectedMembers.value = selectedMembers.value.filter(id => id !== memberId);
        };

        const getUsername = (userId) => {
            const user = admins.value.find(admin => admin.id === userId);
            return user ? user.username : "Inconnu";
        };

        const handleSubmit = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/project/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        name: name.value,
                        billing_type: billing_type.value,
                        status: status.value,
                        total_cost: total_cost.value,
                        estimated_hours: estimated_hours.value,
                        start_date: start_date.value,
                        end_date: end_date.value,
                        description: description.value,
                        client_id: client_id.value,
                        members: selectedMembers.value,
                    }),
                });

                if (response.ok) {
                    toast.success("Projet créé avec succès !");
                    router.push("/admin/project");
                } else {
                    const errorData = await response.json();
                    toast.error(`Erreur lors de la création : ${errorData.message || "Erreur inconnue"}`);
                }
            } catch (error) {
                console.error("Erreur lors de la création du projet :", error);
                toast.error("Erreur lors de la création du projet.");
            }
        };

        return {
            name,
            billing_type,
            status,
            total_cost,
            estimated_hours,
            start_date,
            end_date,
            description,
            client_id,
            clients,
            admins,
            selectedMember,
            selectedMembers,
            addMember,
            removeMember,
            getUsername,
            handleSubmit,
        };
    },
};
</script>

<style scoped>
.create-project {
    padding: 20px;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

textarea {
    width: 100%;
    height: 100px;
}

button {
    background-color: #80d1cc;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #008f82;
}

.member-selector {
    display: flex;
    gap: 10px;
    align-items: center;
}

.member-selector button {
    margin-top: unset;
    width: unset;
}

.member-selector select {
    margin-bottom: unset;
}

.member-list {
    margin-top: 10px;
    list-style: none;
    padding: 0;
}

.member-list button {
    margin-top: unset;
    width: unset;
}

.member-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f4f4f4;
    padding: 5px 10px;
    border-radius: 5px;
    margin-bottom: 5px;
}

.member-list button {
    background: #ff4d4f;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 3px;
}

.member-list button:hover {
    background: #d9363e;
}
</style>
