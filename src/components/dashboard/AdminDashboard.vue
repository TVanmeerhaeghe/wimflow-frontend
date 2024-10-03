<template>
  <Header />
  <div class="admin-dashboard">
    <Sidebar />
    <div class="main-content">
      <div v-if="isAdminDashboard" class="dashboard-content">
        <AdminCalendar />
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '../admin/Sidebar.vue';
import Header from '../shared/Header.vue';
import AdminCalendar from '../admin/widget/AdminCalendar.vue';

export default {
  components: {
    Sidebar,
    Header,
    AdminCalendar
  },
  setup() {
    const route = useRoute();
    const isAdminDashboard = computed(() => route.path === '/admin');

    return {
      isAdminDashboard,
    };
  }
};
</script>

<style scoped>
.admin-dashboard {
  display: flex;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
}

.dashboard-content {
  padding: 20px;
}
</style>
