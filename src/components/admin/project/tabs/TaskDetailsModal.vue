<template>
    <div class="task-details-modal">
        <div class="modal-content">
            <button class="close-button" @click="$emit('close')">&times;</button>
            <h2>Détails de la tâche</h2>
            <p><strong>Titre :</strong> {{ task.title }}</p>
            <p><strong>Description :</strong> {{ task.description }}</p>
            <button class="delete-button" @click="$emit('delete', task.id)">
                🗑 Supprimer
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        task: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style scoped>
.task-details-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    left: 180px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: red;
    width: 100%;
}

.delete-button {
    background: none;
    border: none;
    color: #d9534f;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 20px;
}

.delete-button:hover {
    color: #c9302c;
}
</style>
