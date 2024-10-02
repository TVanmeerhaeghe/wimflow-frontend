<template>
    <div class="maintenance-list">
      <h1>Liste des maintenances</h1>
      <button @click="openCreateMaintenance">Ajouter une maintenance</button>
      
      <table>
        <thead>
          <tr>
            <th>Nom du site</th>
            <th>Statut</th>
            <th>Prochaine maintenance</th>
            <th>Dernière maintenance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="maintenance in maintenances" :key="maintenance.id">
            <td>{{ maintenance.Site.name }}</td>
            <td :class="getStatusClass(maintenance.status)">
              {{ maintenance.status === 'to_do' ? 'À faire' : 'Terminé' }}
            </td>
            <td>{{ formatDate(maintenance.next_maintenance) }}</td>
            <td>{{ formatDate(maintenance.last_maintenance) || 'Aucune' }}</td>
          </tr>
        </tbody>
      </table>
  
      <Popup :show="showPopup" @close="closePopup">
        <CreateMaintenance @created="closePopup" />
      </Popup>
    </div>
  </template>
  
  <script>
  import Popup from '../../shared/Popup.vue';
  import CreateMaintenance from './CreateMaintenance.vue';
  import { ref, onMounted } from 'vue';
  
  export default {
    components: {
      Popup,
      CreateMaintenance
    },
    setup() {
      const maintenances = ref([]);
      const showPopup = ref(false);
  
      onMounted(async () => {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        maintenances.value = await response.json();
      });
  
      const openCreateMaintenance = () => {
        showPopup.value = true; // Ouvre la popup
      };
  
      const closePopup = () => {
        showPopup.value = false; // Ferme la popup
      };
  
      const getStatusClass = (status) => {
        return status === 'to_do' ? 'status-to-do' : 'status-done';
      };
  
      const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString();
      };
  
      return {
        maintenances,
        showPopup,
        openCreateMaintenance,
        closePopup,
        getStatusClass,
        formatDate
      };
    }
  };
  </script>
  
  <style scoped>
  button {
    margin-bottom: 20px;
    background-color: #00c9bd;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #008f82;
  }
  
  .status-to-do {
    color: orange;
  }
  
  .status-done {
    color: green;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #00c9bd;
    color: white;
  }
  </style>
  