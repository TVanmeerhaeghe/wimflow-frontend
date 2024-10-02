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
            <th>Actions</th> 
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="maintenance in sortedMaintenances"
            :key="maintenance.id"
            :class="{ inactive: !maintenance.Site.maintenance_status }"
          >
            <td v-if="maintenance.Site">{{ maintenance.Site.name }}</td>
            <td v-else>Non défini</td>
            <td :class="getStatusClass(maintenance.status)">
              <select v-model="maintenance.status" @change="updateStatus(maintenance)">
                <option value="to_do">À faire</option>
                <option value="done">Terminé</option>
              </select>
            </td>
            <td>{{ formatDate(maintenance.next_maintenance) }}</td>
            <td>{{ formatDate(maintenance.last_maintenance) || 'Aucune' }}</td>
            <td>
              <button @click="editMaintenance(maintenance.id)">Modifier</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <Popup :show="showPopup" @close="closePopup">
        <CreateMaintenance @created="closePopup" />
      </Popup>
    </div>
  </template>
  
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Popup from '../../shared/Popup.vue';
  import CreateMaintenance from './CreateMaintenance.vue';
  
  export default {
    components: {
      Popup,
      CreateMaintenance
    },
    setup() {
      const maintenances = ref([]);
      const showPopup = ref(false);
      const router = useRouter();
  
      onMounted(async () => {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        maintenances.value = await response.json();
      });
  
    const sortedMaintenances = computed(() => {
        return [...maintenances.value].sort((a, b) => {
            return a.Site.maintenance_status === b.Site.maintenance_status
            ? 0
            : a.Site.maintenance_status
            ? -1
            : 1;
        });
    });
  
      const openCreateMaintenance = () => {
        showPopup.value = true; 
      };
  
      const closePopup = () => {
        showPopup.value = false;
      };
  
      const updateStatus = async (maintenance) => {
        if (maintenance.status === 'done') {
          const now = new Date();
          maintenance.last_maintenance = now;
          maintenance.next_maintenance = new Date(now.setMonth(now.getMonth() + 1));
  
          try {
            await fetch(`${process.env.VUE_APP_API_URL}/maintenance/maintenance/${maintenance.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                status: maintenance.status,
                next_maintenance: maintenance.next_maintenance,
                last_maintenance: maintenance.last_maintenance
              }),
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour du statut', error);
          }
        }
      };
  
      const editMaintenance = (id) => {
        router.push(`/admin/maintenance/edit/${id}`);
      };
  
      const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString();
      };
  
      const getStatusClass = (status) => {
        return status === 'to_do' ? 'status-to-do' : 'status-done';
      };
  
      return {
        maintenances,
        sortedMaintenances,
        showPopup,
        openCreateMaintenance,
        closePopup,
        updateStatus,
        editMaintenance,
        formatDate,
        getStatusClass
      };
    }
  };
  </script>
  
  
  <style scoped>
  .inactive {
    opacity: 0.6;
  }
  
  .status-to-do {
    color: orange;
  }
  
  .status-done {
    color: green;
  }
  
  button {
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
  
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
  }
  
  .close-btn {
    margin-top: 20px;
    background-color: #00c9bd;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .close-btn:hover {
    background-color: #008f82;
  }
  </style>
  
  