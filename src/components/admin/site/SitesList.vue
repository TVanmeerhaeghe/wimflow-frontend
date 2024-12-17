<template>
  <div class="site-list">
    <h1>Sites</h1>

    <input type="text" v-model="searchQuery" placeholder="Rechercher un site par nom ou URL" class="search-bar" />

    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>URL</th>
          <th>Email de maintenance</th>
          <th>Statut de maintenance</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="site in filteredSites" :key="site.id">
          <td>{{ site.name }}</td>
          <td><a :href="site.url">{{ site.url }}</a></td>
          <td>{{ site.email_maintenance }}</td>
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

    <button @click="openCreateSite" class="add-site-button">Ajouter un site</button>

    <Popup :show="showPopup" @close="closePopup">
      <CreateSite @created="closePopup" />
    </Popup>
  </div>
</template>

<script>
import Popup from "../../shared/Popup.vue";
import CreateSite from "./CreateSite.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  components: { Popup, CreateSite },
  setup() {
    const sites = ref([]);
    const searchQuery = ref("");
    const showPopup = ref(false);
    const router = useRouter();
    const toast = useToast();

    const loadSites = async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/site`, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
        sites.value = await response.json();
      } catch (error) {
        console.error("Erreur lors du chargement des sites :", error);
        toast.error("Erreur lors du chargement des sites.");
      }
    };

    onMounted(loadSites);

    const toggleMaintenance = async (site) => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/site/modify/${site.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ maintenance_status: site.maintenance_status }),
        });

        if (response.ok) {
          toast.success("Statut de maintenance mis à jour.");
        } else {
          toast.error("Erreur lors de la mise à jour du statut.");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
        toast.error("Erreur lors de la mise à jour du statut.");
      }
    };

    const editSite = (id) => {
      router.push(`/admin/site/edit/${id}`);
    };

    const filteredSites = computed(() => {
      return sites.value.filter((site) =>
        site.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        site.url.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    return {
      sites,
      searchQuery,
      showPopup,
      toggleMaintenance,
      editSite,
      filteredSites,
      loadSites,
    };
  },
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
  margin-top: unset;
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

.add-site-button {
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

.add-site-button:hover {
  background-color: #008f82;
}
</style>
