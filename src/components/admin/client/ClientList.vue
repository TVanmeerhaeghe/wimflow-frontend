<template>
  <div class="client-list">
    <div class="header-client">
      <h1>Clients</h1>
      <div class="client-stats">
        <div class="client-actif">
          <p>{{ activeClientsCount }}</p>
          <p class="clients-stats-p">clients actifs</p>
        </div>
        <div class="client-inactif">
          <p>{{ inactiveClientsCount }}</p>
          <p class="clients-stats-p">clients inactifs</p>
        </div>
      </div>
    </div>

    <input type="text" v-model="searchQuery" placeholder="Rechercher un client par nom ou entreprise"
      class="search-bar" />

    <table>
      <thead>
        <tr>
          <th>Entreprise</th>
          <th>Téléphone</th>
          <th>Email</th>
          <th>Date d'inscription</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in filteredClients" :key="client.id">
          <td>{{ client.company }}</td>
          <td>{{ client.phone || "Non défini" }}</td>
          <td>{{ client.email || "Non défini" }}</td>
          <td>{{ client.registration_date ? new Date(client.registration_date).toLocaleDateString() : "Non défini" }}
          </td>
          <td>
            <label class="switch">
              <input type="checkbox" :checked="client.status === 'actif'" @change="toggleStatus(client)" />
              <span class="slider round"></span>
            </label>
          </td>
          <td>
            <button @click="editClient(client.id)">Modifier</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="openCreateClient" class="add-client-button">
      Ajouter un client
    </button>

    <Popup :show="showPopup" @close="closePopup">
      <CreateClient @created="onClientCreated" />
    </Popup>

  </div>
</template>

<script>
import Popup from "../../shared/Popup.vue";
import CreateClient from "./CreateClient.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  components: {
    Popup,
    CreateClient,
  },
  setup() {
    const clients = ref([]);
    const searchQuery = ref("");
    const showPopup = ref(false);
    const router = useRouter();
    const toast = useToast();

    const fetchClients = async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/client`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        clients.value = await response.json();
      } catch (error) {
        toast.error("Erreur lors du chargement des clients.");
        console.error("Erreur fetchClients :", error);
      }
    };

    onMounted(fetchClients);

    const editClient = (id) => {
      router.push(`/admin/client/edit/${id}`);
    };

    const openCreateClient = () => {
      showPopup.value = true;
    };

    const closePopup = () => {
      showPopup.value = false;
    };

    const onClientCreated = () => {
      closePopup();
      toast.success("Liste des clients mise à jour.");
      fetchClients();
    };

    const toggleStatus = async (client) => {
      client.status = client.status === "actif" ? "inactif" : "actif";
      try {
        await fetch(`${process.env.VUE_APP_API_URL}/client/modify/${client.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: client.status }),
        });
        toast.success(`Statut de ${client.company} mis à jour avec succès.`);
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du statut.");
      }
    };

    const filteredClients = computed(() => {
      return clients.value.filter((client) => {
        return (
          client.company.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });
    });

    const activeClientsCount = computed(() => {
      return clients.value.filter((client) => client.status === "actif").length;
    });

    const inactiveClientsCount = computed(() => {
      return clients.value.filter((client) => client.status === "inactif").length;
    });

    return {
      clients,
      searchQuery,
      showPopup,
      editClient,
      openCreateClient,
      closePopup,
      filteredClients,
      toggleStatus,
      activeClientsCount,
      inactiveClientsCount,
      onClientCreated,
      fetchClients,
    };
  },
};
</script>


<style scoped>
.header-client {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.client-stats {
  display: flex;
  gap: 50px;
  font-size: 20px;
  font-weight: 600;
  color: white;
  background-color: #f1f1f1;
  padding: 10px 30px;
  border-radius: 8px;
  text-align: center;
}

.clients-stats-p {
  font-size: 14px;
}

.client-actif {
  color: #008f82;
}

.client-inactif {
  color: #d16c6c;
}

button {
  width: 100%;
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

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #008f82;
}

input:checked+.slider:before {
  transform: translateX(18px);
}
</style>
