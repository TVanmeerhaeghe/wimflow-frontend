<template>
    <div class="edit-maintenance">
      <h1>Modifier la maintenance</h1>
      <form @submit.prevent="updateMaintenance">
        <div class="form-group">
          <label for="nextMaintenance">Prochaine date de maintenance</label>
          <input type="date" v-model="maintenance.next_maintenance" required />
        </div>
        <div class="form-group">
          <label for="status">Statut</label>
          <select v-model="maintenance.status" required>
            <option value="to_do">À faire</option>
            <option value="done">Terminé</option>
          </select>
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  export default {
    setup() {
      const maintenance = ref({});
      const route = useRoute();
      const router = useRouter();
  
      onMounted(async () => {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance/maintenance/${route.params.id}`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        maintenance.value = await response.json();
      });
  
      const updateMaintenance = async () => {
        await fetch(`${process.env.VUE_APP_API_URL}//maintenance/${route.params.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(maintenance.value),
        });
        router.push('/admin/maintenances');
      };
  
      return {
        maintenance,
        updateMaintenance
      };
    }
  };
  </script>
  
  