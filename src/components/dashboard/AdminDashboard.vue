<template>
  <Header />
  <div class="admin-dashboard">
    <Sidebar />
    <div class="main-content">
      <div class="dashboard-content">
        <div v-if="isDashboardRoute" class="next-maintenance-block">
          <h2>Prochaine Maintenance</h2>
          <p>Site : {{ nextMaintenance.siteName }}</p>
          <p>Date : {{ formatDate(nextMaintenance.date) }}</p>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Sidebar from '../admin/Sidebar.vue';
import Header from '../shared/Header.vue';
import { useRoute } from 'vue-router';

export default {
  components: {
    Sidebar,
    Header,
  },
  setup() {
    const route = useRoute();
    const nextMaintenance = ref({ siteName: null, date: null });

    const isDashboardRoute = computed(() => route.path === '/admin');

    const formatDate = (date) => {
      if (!date) return "Aucune date";
      return new Date(date).toLocaleDateString();
    };

    onMounted(async () => {
      if (isDashboardRoute.value) {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance/next`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        nextMaintenance.value = data;
      }
    });

    return {
      nextMaintenance,
      formatDate,
      isDashboardRoute,
    };
  },
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

.next-maintenance-block {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>
