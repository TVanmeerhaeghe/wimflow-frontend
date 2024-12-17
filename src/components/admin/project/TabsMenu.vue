<template>
    <div class="tabs-menu">
        <router-link v-for="tab in tabs" :key="tab.path" :to="`/admin/project/details/${projectId}${tab.path}`"
            class="tab" :class="{ active: isActive(tab.path) }">
            {{ tab.label }}
        </router-link>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
    props: {
        projectId: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        const route = useRoute();

        const tabs = [
            { path: '/overview', label: 'Aperçu' },
            { path: '/kanban', label: 'Kanban' },
            { path: '/edit', label: 'Modifier' },
        ];

        const isActive = (path) => route.path === `/admin/project/details/${props.projectId}${path}`;

        return { tabs, isActive };
    },
};
</script>

<style scoped>
.tabs-menu {
    display: flex;
    border-bottom: 2px solid #ddd;
    margin-bottom: 20px;
}

.tab {
    padding: 10px 20px;
    text-decoration: none;
    color: #333;
    border-bottom: 2px solid transparent;
    cursor: pointer;
}

.tab:hover {
    background-color: #f0f0f0;
}

.tab.active {
    border-bottom: 2px solid #80d1cc;
    font-weight: bold;
}
</style>
