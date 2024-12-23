<template>
    <div class="kanban-board">
        <h1>Tâches du projet : {{ projectName }}</h1>

        <div class="board-columns">
            <div v-for="(tasks, status) in tasksByStatus" :key="status" class="column" @dragover.prevent
                @drop="onDrop(status)">
                <h2>{{ getColumnTitle(status) }}</h2>

                <div class="task-card" v-for="task in tasks" :key="task.id" draggable="true"
                    @dragstart="onDragStart(task)" @dragend="onDragEnd" @click="openTaskDetails(task)">
                    <h3>{{ task.title }}</h3>
                </div>

                <button v-if="status === 'backlog'" @click="openNewTaskModal(status)">+ Ajouter une tâche</button>
            </div>
        </div>

        <TaskDetailsModal v-if="selectedTask" :task="selectedTask" @close="closeTaskDetails" @delete="deleteTask" />

        <div v-if="showNewTaskModal" class="modal-overlay">
            <div class="modal">
                <button class="close-button" @click="closeNewTaskModal">&times;</button>
                <h3>Nouvelle tâche</h3>
                <input type="text" v-model="newTask.title" placeholder="Titre" />
                <textarea v-model="newTask.description" placeholder="Description"></textarea>
                <button @click="createTask">Créer</button>
            </div>
        </div>

    </div>
</template>


<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import TaskDetailsModal from './TaskDetailsModal.vue';

export default {
    components: {
        TaskDetailsModal,
    },
    setup() {
        const route = useRoute();
        const toast = useToast();

        const projectName = ref('');
        const tasks = ref([]);
        const showNewTaskModal = ref(false);
        const newTask = ref({
            title: '',
            description: '',
            status: 'to_do',
            file: null,
        });
        const selectedTask = ref(null);

        const fetchTasks = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/project/project-task/${route.params.id}/tasks`, {
                    headers: { Authorization: localStorage.getItem('token') },
                });
                const data = await response.json();
                tasks.value = data;
            } catch {
                toast.error("Erreur lors du chargement des tâches.");
            }
        };

        const tasksByStatus = computed(() => ({
            backlog: tasks.value.filter(task => task.status === 'backlog'),
            to_do: tasks.value.filter(task => task.status === 'to_do'),
            in_progress: tasks.value.filter(task => task.status === 'in_progress'),
            done: tasks.value.filter(task => task.status === 'done'),
        }));

        const getColumnTitle = (status) => {
            return status === 'backlog' ? 'Backlog' :
                status === 'to_do' ? 'À faire' :
                    status === 'in_progress' ? 'En cours' : 'Terminé';
        };

        const openTaskDetails = (task) => {
            selectedTask.value = task;
        };

        const closeTaskDetails = () => {
            selectedTask.value = null;
        };

        const openNewTaskModal = (status) => {
            showNewTaskModal.value = true;
            newTask.value.status = status;
        };

        const closeNewTaskModal = () => {
            showNewTaskModal.value = false;
            newTask.value = { title: '', description: '', status: 'to_do', file: null };
        };

        const createTask = async () => {
            const formData = new FormData();
            formData.append('title', newTask.value.title);
            formData.append('description', newTask.value.description);
            formData.append('status', newTask.value.status);

            if (newTask.value.file) {
                formData.append('image', newTask.value.file);
            }

            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/project/project-task/${route.params.id}/tasks`, {
                    method: 'POST',
                    headers: { Authorization: localStorage.getItem('token') },
                    body: formData,
                });

                if (response.ok) {
                    toast.success("Tâche ajoutée avec succès.");
                    fetchTasks();
                    closeNewTaskModal();
                } else {
                    toast.error("Erreur lors de l'ajout de la tâche.");
                }
            } catch {
                toast.error("Erreur lors de l'ajout de la tâche.");
            }
        };

        const draggedTask = ref(null);

        const onDragStart = (task) => {
            draggedTask.value = task;
        };

        const onDragEnd = () => {
            draggedTask.value = null;
        };

        const onDrop = async (newStatus) => {
            if (!draggedTask.value) return;

            draggedTask.value.status = newStatus;

            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/project/project-task/tasks/${draggedTask.value.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token'),
                    },
                    body: JSON.stringify({ status: newStatus }),
                });

                if (response.ok) {
                    fetchTasks();
                    toast.success("Tâche mise à jour avec succès !");
                } else {
                    throw new Error("Erreur API");
                }
            } catch {
                toast.error("Erreur lors de la mise à jour du statut.");
            }

            draggedTask.value = null;
        };

        const deleteTask = async (taskId) => {
            if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) return;

            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/project/project-task/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });

                if (response.ok) {
                    toast.success("Tâche supprimée avec succès !");
                    fetchTasks();
                    closeTaskDetails();
                } else {
                    toast.error("Erreur lors de la suppression de la tâche.");
                }
            } catch (error) {
                toast.error("Erreur réseau lors de la suppression.");
            }
        };


        onMounted(fetchTasks);

        return {
            projectName,
            tasksByStatus,
            selectedTask,
            getColumnTitle,
            openTaskDetails,
            closeTaskDetails,
            showNewTaskModal,
            newTask,
            openNewTaskModal,
            closeNewTaskModal,
            createTask,
            onDragEnd,
            onDragStart,
            onDrop,
            deleteTask
        };
    },
};
</script>


<style scoped>
.kanban-board {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.board-columns {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 50px;
}

.column {
    width: 30%;
    background-color: #80d1cc33;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.column:hover {
    background-color: #008f8233;
}

.task-card {
    background: white;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
}

.task-image {
    width: 100%;
    max-height: 150px;
    object-fit: cover;
    margin-top: 10px;
    border-radius: 5px;
}

button:not(.close-button) {
    background-color: #80d1cc;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 3px;
}

button:hover:not(.close-button) {
    background-color: #008f82;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 20%;
    left: 30%;
    width: 40%;
}

textarea {
    width: 98%;
    margin-top: 20px;
}

.close-button {
    position: absolute;
    top: 10px;
    left: 500px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: red;
    width: 100%;
}
</style>
