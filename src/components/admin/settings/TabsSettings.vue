<template>
    <div class="tabs-menu">
        <router-link v-for="tab in tabs" :key="tab.path" :to="tab.path" class="tab"
            :class="{ active: isActive(tab.path) }">
            {{ tab.label }}
        </router-link>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
    name: "TabsMenu",
    setup() {
        const route = useRoute();

        const tabs = [
            { path: '/admin/settings/company-info', label: 'Infos de l\'entreprise' },
            { path: '/admin/settings/date-format', label: 'Format de la date' },
        ];

        const isActive = (path) => route.path === path;

        return {
            tabs,
            isActive,
        };
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