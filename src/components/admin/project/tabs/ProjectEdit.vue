<template>
    <div class="edit-project">
        <form @submit.prevent="handleUpdate">
            <div class="form-row">
                <div class="form-group">
                    <label for="name">Nom du projet</label>
                    <input type="text" id="name" v-model="project.name" required />
                </div>
                <div class="form-group">
                    <label for="billing_type">Type de facturation</label>
                    <select id="billing_type" v-model="project.billing_type" required>
                        <option value="forfait">Forfait</option>
                        <option value="horaire">Horaire</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="client">Client</label>
                    <select id="client" v-model="project.client_id" required>
                        <option v-for="client in clients" :key="client.id" :value="client.id">
                            {{ client.company }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Collaborateurs</label>
                    <div class="member-selector">
                        <select v-model="selectedMember">
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
                    <select id="status" v-model="project.status" required>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                        <option value="En attente">En attente</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="total_cost">Coût total</label>
                    <input type="number" id="total_cost" v-model="project.total_cost" required />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="start_date">Date de début</label>
                    <input type="date" id="start_date" v-model="project.start_date" required />
                </div>
                <div class="form-group">
                    <label for="end_date">Date de fin</label>
                    <input type="date" id="end_date" v-model="project.end_date" />
                </div>
            </div>

            <div class="form-group full-width">
                <label for="description">Description</label>
                <textarea id="description" v-model="project.description"></textarea>
            </div>

            <button type="submit">Mettre à jour</button>
        </form>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import formatDate from "@/utils/formatDate";

export default {
    setup() {
        const project = ref({});
        const clients = ref([]);
        const admins = ref([]);
        const selectedMember = ref(null);
        const selectedMembers = ref([]);
        const route = useRoute();
        const router = useRouter();
        const toast = useToast();

        const fetchProject = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/project/${route.params.id}`, {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                const data = await response.json();

                project.value = {
                    ...data,
                    start_date: formatDate(data.start_date),
                    end_date: formatDate(data.end_date),
                };
                selectedMembers.value = data.Members.map((member) => member.id);
            } catch (error) {
                toast.error("Erreur lors de la récupération du projet.");
                console.error("Erreur :", error);
            }
        };

        const fetchClientsAndAdmins = async () => {
            try {
                const [clientsResponse, adminsResponse] = await Promise.all([
                    fetch(`${process.env.VUE_APP_API_URL}/client`, {
                        headers: { Authorization: localStorage.getItem("token") },
                    }),
                    fetch(`${process.env.VUE_APP_API_URL}/user`, {
                        headers: { Authorization: localStorage.getItem("token") },
                    }),
                ]);
                clients.value = await clientsResponse.json();
                admins.value = await adminsResponse.json();
            } catch (error) {
                toast.error("Erreur lors du chargement des données.");
                console.error("Erreur :", error);
            }
        };

        const addMember = () => {
            if (selectedMember.value && !selectedMembers.value.includes(selectedMember.value)) {
                selectedMembers.value.push(selectedMember.value);
                selectedMember.value = null;
            }
        };

        const removeMember = (memberId) => {
            selectedMembers.value = selectedMembers.value.filter((id) => id !== memberId);
        };

        const getUsername = (userId) => {
            const user = admins.value.find((admin) => admin.id === userId);
            return user ? user.username : "Inconnu";
        };

        const handleUpdate = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/project/modify/${route.params.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        ...project.value,
                        members: selectedMembers.value,
                    }),
                });

                if (response.ok) {
                    toast.success("Projet mis à jour avec succès !");
                    router.push(`/admin/project/details/${route.params.id}/overview`);
                } else {
                    toast.error("Erreur lors de la mise à jour du projet.");
                }
            } catch (error) {
                toast.error("Erreur lors de la mise à jour du projet.");
                console.error("Erreur :", error);
            }
        };

        onMounted(() => {
            fetchProject();
            fetchClientsAndAdmins();
        });

        return {
            project,
            clients,
            admins,
            selectedMember,
            selectedMembers,
            addMember,
            removeMember,
            getUsername,
            handleUpdate,
            formatDate,
        };
    },
};
</script>

<style scoped>
.edit-project {
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
