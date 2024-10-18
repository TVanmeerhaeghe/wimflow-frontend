<template>
    <div class="settings-page">
        <TabsSettings />
        <router-view />
    </div>
</template>

<script>
import TabsSettings from './TabsSettings.vue';

export default {
    name: 'Settings',
    components: {
        TabsSettings,
    },
};
</script>

<style scoped>
.settings-page {
    display: flex;
    flex-direction: column;
}
</style>