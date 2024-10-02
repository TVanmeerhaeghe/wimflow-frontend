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
          </tr>
        </thead>
        <tbody>
          <tr v-for="site in sites" :key="site.id">
            <td>{{ site.name }}</td>
            <td>{{ site.url }}</td>
            <td :class="getStatusClass(site.maintenance_status)">
              {{ site.maintenance_status ? 'Activé' : 'Désactivé' }}
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
  import { ref, onMounted } from 'vue';
  
  export default {
    components: {
      Popup,
      CreateSite
    },
    setup() {
      const sites = ref([]);
      const showPopup = ref(false);
  
      onMounted(async () => {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance/sites`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        sites.value = await response.json();
      });
  
      const openCreateSite = () => {
        showPopup.value = true;
      };
  
      const closePopup = () => {
        showPopup.value = false;
      };
  
      const getStatusClass = (status) => {
        return status ? 'status-active' : 'status-inactive';
      };
  
      return {
        sites,
        showPopup,
        openCreateSite,
        closePopup,
        getStatusClass,
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
  
  .status-active {
    color: green;
  }
  
  .status-inactive {
    color: red;
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
  