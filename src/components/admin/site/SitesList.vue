<template>
    <div class="site-list">
      <h1>Liste des sites</h1>
      <button @click="openCreateSite">Ajouter un site</button>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>URL</th>
            <th>Statut de maintenance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="site in sortedSites" :key="site.id" :class="{'inactive': !site.maintenance_status}">
            <td>{{ site.name }}</td>
            <td>{{ site.url }}</td>
            <td>
              <select v-model="site.maintenance_status" @change="toggleMaintenance(site)">
                <option :value="true">Activé</option>
                <option :value="false">Désactivé</option>
              </select>
            </td>
            <td>
              <button @click="editSite(site.id)">Modifier</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <Popup :show="showPopup" @close="closePopup">
        <CreateSite @created="closePopup" />
      </Popup>
    </div>
  </template>
  
  <script>
  import Popup from '../../shared/Popup.vue';
  import CreateSite from './CreateSite.vue';
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    components: {
      Popup,
      CreateSite
    },
    setup() {
      const sites = ref([]);
      const showPopup = ref(false);
      const router = useRouter();
  
      onMounted(async () => {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance/sites`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        sites.value = await response.json();
      });
  
      const toggleMaintenance = async (site) => {
        try {
          await fetch(`${process.env.VUE_APP_API_URL}/maintenance/site/${site.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ maintenance_status: site.maintenance_status }),
          });
        } catch (error) {
          console.error('Erreur lors de la mise à jour du statut', error);
        }
      };
  
      const editSite = (id) => {
        router.push(`/admin/site/edit/${id}`);
      };
  
      const openCreateSite = () => {
        showPopup.value = true;
      };
  
      const closePopup = () => {
        showPopup.value = false;
      };
  
      return {
        sites,
        showPopup,
        toggleMaintenance,
        editSite,
        openCreateSite,
        closePopup,
        sortedSites: computed(() => {
          return [...sites.value].sort((a, b) => a.maintenance_status === b.maintenance_status ? 0 : a.maintenance_status ? -1 : 1);
        }),
      };
    }
  };
  </script>
  
  <style scoped>
  button {
    background-color: #00c9bd;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  button:hover {
    background-color: #008f82;
  }
  

  .status-active {
    color: green;
  }
  
  .status-inactive {
    color: red;
  }
  

  .inactive {
    opacity: 0.6;
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
  
  td {
    text-align: left;
  }
  
  .site-list {
    padding: 20px;
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
  
  