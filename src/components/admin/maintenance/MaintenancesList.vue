<template>
  <div class="maintenance-list">
    <h1>Maintenances</h1>

    <input type="text" v-model="searchQuery" placeholder="Rechercher une maintenance par nom de site"
      class="search-bar" />

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
        <tr v-for="maintenance in sortedMaintenances" :key="maintenance.id"
          :class="{ inactive: !maintenance.Site.maintenance_status }">
          <td v-if="maintenance.Site">{{ maintenance.Site.name }}</td>
          <td v-else>Non défini</td>
          <td :class="getStatusClass(maintenance.status)">
            <select v-model="maintenance.status" @change="updateStatus(maintenance)"
              :disabled="!maintenance.Site.maintenance_status">
              <option value="to_do">À faire</option>
              <option value="done">Terminé</option>
            </select>
          </td>
          <td>{{ formatDate(maintenance.next_maintenance) }}</td>
          <td>{{ formatDate(maintenance.last_maintenance) || 'Aucune' }}</td>
          <td>
            <button @click="viewMaintenanceDetails(maintenance.id)" :disabled="!maintenance.Site.maintenance_status">
              Détails
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="openCreateMaintenance" class="add-maintenance-button">
      Ajouter une maintenance
    </button>

    <Popup :show="showPopup" @close="closePopup">
      <CreateMaintenance :onClose="closePopup" :reloadTable="loadMaintenances" />
    </Popup>
  </div>
</template>

<script>
import Popup from '../../shared/Popup.vue';
import CreateMaintenance from './CreateMaintenance.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import formatDate from "@/utils/formatDate";

export default {
  components: {
    Popup,
    CreateMaintenance,
  },
  setup() {
    const maintenances = ref([]);
    const searchQuery = ref('');
    const showPopup = ref(false);
    const router = useRouter();
    const toast = useToast();

    const loadMaintenances = async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        maintenances.value = await response.json();
      } catch (error) {
        console.error('Erreur lors de la récupération des maintenances', error);
        toast.error('Erreur lors de la récupération des maintenances.');
      }
    };

    onMounted(loadMaintenances);

    const updateStatus = async (maintenance) => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance/modify/${maintenance.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            status: maintenance.status,
          }),
        });

        if (response.ok) {
          toast.success('Statut mis à jour avec succès.');
        } else {
          throw new Error('Erreur serveur');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut', error);
        toast.error('Erreur lors de la mise à jour du statut.');
      }
    };

    const viewMaintenanceDetails = (id) => {
      router.push(`/admin/maintenance/details/${id}`);
    };

    const filteredMaintenances = computed(() => {
      return maintenances.value.filter((maintenance) => {
        return maintenance.Site?.name.toLowerCase().includes(searchQuery.value.toLowerCase());
      });
    });

    const sortedMaintenances = computed(() => {
      return [...filteredMaintenances.value].sort((a, b) => {
        if (a.Site.maintenance_status === b.Site.maintenance_status) {
          return 0;
        }
        return a.Site.maintenance_status ? -1 : 1;
      });
    });

    const openCreateMaintenance = () => {
      showPopup.value = true;
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    const getStatusClass = (status) => {
      return status === 'to_do' ? 'status-to-do' : 'status-done';
    };

    return {
      maintenances,
      searchQuery,
      showPopup,
      sortedMaintenances,
      openCreateMaintenance,
      closePopup,
      formatDate,
      getStatusClass,
      updateStatus,
      viewMaintenanceDetails,
      loadMaintenances,
    };
  },
};
</script>

<style scoped>
.inactive {
  opacity: 0.6;
}

select:disabled,
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button {
  background-color: #80d1cc;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.add-maintenance-button {
  background-color: #80d1cc;
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 50px;
  width: 250px;
  position: relative;
  left: 82%;
}

button:hover:not(:disabled) {
  background-color: #008f82;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #80d1cc;
  color: white;
}

td {
  text-align: center;
}

.search-bar {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ddd;
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
  background-color: #80d1cc;
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
