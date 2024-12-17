<template>
    <div>
        <p>Nom : {{ project.name }}</p>
        <p>Description : {{ project.description }}</p>
        <p>Date de début : {{ project.start_date }}</p>
        <p>Date de fin : {{ project.end_date || 'En cours' }}</p>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const project = ref({});

        onMounted(async () => {
            const response = await fetch(`${process.env.VUE_APP_API_URL}/project/${route.params.id}`, {
                headers: { Authorization: localStorage.getItem('token') },
            });
            project.value = await response.json();
        });

        return { project };
    },
};
</script>
