<template>
    <div class="client-list">
      <h1>Clients</h1>
  
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Rechercher un client par nom ou entreprise" 
        class="search-bar" 
      />
  
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Entreprise</th>
            <th>Adresse complète</th>
            <th>Site associé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in filteredClients" :key="client.id">
            <td>{{ client.last_name || 'Non défini' }}</td>
            <td>{{ client.first_name || 'Non défini' }}</td>
            <td>{{ client.company }}</td>
            <td>{{ client.address }} {{  client.city }} {{  client.postal_code }}</td>
            <td>{{ client.Site ? client.Site.name : 'Aucun' }}</td>
            <td>
              <button @click="editClient(client.id)">Modifier</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <button @click="openCreateClient" class="add-client-button">Ajouter un client</button>
  
      <Popup :show="showPopup" @close="closePopup">
        <CreateClient @created="closePopup" />
      </Popup>
    </div>
</template>
  
<script>
  import Popup from '../../shared/Popup.vue';
  import CreateClient from './CreateClient.vue';
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    components: {
      Popup,
      CreateClient
    },
    setup() {
      const clients = ref([]);
      const searchQuery = ref('');
      const showPopup = ref(false);
      const router = useRouter();
  
      onMounted(async () => {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/client`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        clients.value = await response.json();
      });
  
      const editClient = (id) => {
        router.push(`/admin/client/edit/${id}`);
      };
  
      const openCreateClient = () => {
        showPopup.value = true;
      };
  
      const closePopup = () => {
        showPopup.value = false;
      };
  
      const filteredClients = computed(() => {
        return clients.value.filter(client => {
          return (
            client.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (client.last_name || '').toLowerCase().includes(searchQuery.value.toLowerCase())
          );
        });
      });
  
      const formatAddress = (city, postal_code) => {
        if (!city && !postal_code) return 'Non défini';
        return `${city || ''} ${postal_code || ''}`.trim();
      };
  
      return {
        clients,
        searchQuery,
        showPopup,
        editClient,
        openCreateClient,
        closePopup,
        filteredClients,
        formatAddress,
      };
    }
  };
</script>
  
<style scoped>
  button {
    background-color: #80d1cc;
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
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
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
  
  .add-client-button {
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
  
  .add-client-button:hover {
    background-color: #008f82;
  }
</style>
  