<template>
    <div class="projects-list">
        <h1>Projets</h1>

        <input type="text" v-model="searchQuery" placeholder="Rechercher un projet par nom ou client"
            class="search-bar" />

        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Client</th>
                    <th>Date de début</th>
                    <th>Date de fin</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="project in filteredProjects" :key="project.id">
                    <td>
                        <router-link :to="`/admin/project/details/${project.id}/overview`" class="project-link">
                            {{ project.name }}
                        </router-link>
                    </td>

                    <td>{{ project.Client?.company || "Non défini" }}</td>
                    <td>{{ formatDate(project.start_date) }}</td>
                    <td>{{ formatDate(project.end_date) || "En cours" }}</td>
                </tr>
            </tbody>
        </table>

        <button @click="createProject" class="add-project-button">Créer un projet</button>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
    setup() {
        const projects = ref([]);
        const searchQuery = ref("");
        const router = useRouter();
        const toast = useToast();

        const fetchProjects = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/project`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des projets.");
                }

                const data = await response.json();
                projects.value = Array.isArray(data) ? data : [];
            } catch (error) {
                toast.error("Erreur lors du chargement des projets.");
                projects.value = [];
            }
        };

        onMounted(fetchProjects);

        const createProject = () => {
            router.push("/admin/project/create");
        };

        const filteredProjects = computed(() => {
            return projects.value.filter((project) => {
                return (
                    project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    project.Client?.company.toLowerCase().includes(searchQuery.value.toLowerCase())
                );
            });
        });

        const formatDate = (date) => {
            if (!date) return "N/A";
            return new Date(date).toLocaleDateString();
        };

        return {
            projects,
            searchQuery,
            filteredProjects,
            createProject,
            formatDate,
        };
    },
};
</script>

<style scoped>
.projects-list {
    padding: 20px;
}

.search-bar {
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.add-project-button {
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

.add-project-button:hover {
    background-color: #008f82;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #80d1cc;
    color: white;
}

td {
    text-align: center;
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
</style>