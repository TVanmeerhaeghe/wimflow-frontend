<template>
    <div class="project-details">
        <h1>Détails du projet : {{ project.name }}</h1>
        <TabsMenu :projectId="project.id" />
        <router-view />
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TabsMenu from './TabsMenu.vue';

export default {
    components: { TabsMenu },
    setup() {
        const route = useRoute();
        const project = ref({});

        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/project/${route.params.id}`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                project.value = await response.json();
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du projet:', error);
            }
        };

        onMounted(fetchProjectDetails);

        return { project };
    },
};
</script>

<style scoped>
.project-details {
    padding: 20px;
}
</style>
