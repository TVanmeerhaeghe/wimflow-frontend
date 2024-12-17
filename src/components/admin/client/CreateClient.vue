<template>
  <div>
    <h1>Créer un client</h1>
    <form @submit.prevent="createClient" class="form-container">
      <div class="form-row">
        <div class="form-group">
          <label for="last_name">Nom</label>
          <input type="text" v-model="last_name" />
        </div>
        <div class="form-group">
          <label for="first_name">Prénom</label>
          <input type="text" v-model="first_name" />
        </div>
      </div>

      <div class="form-group">
        <label for="company">Entreprise</label>
        <input type="text" v-model="company" required />
      </div>

      <div class="form-group">
        <label for="phone">Téléphone</label>
        <input type="text" v-model="phone" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" />
      </div>

      <div class="form-group">
        <label for="client_type">Type de Client</label>
        <select v-model="client_type">
          <option value="" disabled selected>Choisir un type</option>
          <option value="Individuel">Individuel</option>
          <option value="Entreprise">Entreprise</option>
          <option value="Organisation">Organisation</option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">Statut</label>
        <select v-model="status">
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      <div class="form-group">
        <label for="site">Site associé</label>
        <div class="site-select-container">
          <select v-model="selectedSiteId">
            <option value="" disabled selected>Choisir un site</option>
            <option v-for="site in sites" :key="site.id" :value="site.id">
              {{ site.name }}
            </option>
          </select>
          <button @click.prevent="openCreateSite" class="add-site-button">
            Ajouter un site
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="address">Adresse</label>
        <input type="text" v-model="address" required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="postal_code">Code Postal</label>
          <input type="text" v-model="postal_code" required />
        </div>
        <div class="form-group">
          <label for="city">Ville</label>
          <input type="text" v-model="city" required />
        </div>
      </div>

      <button type="submit">Créer</button>
    </form>

    <Popup :show="showSitePopup" @close="closeSitePopup">
      <CreateSite @created="fetchSites" />
    </Popup>
  </div>
</template>

<script>
import Popup from "../../shared/Popup.vue";
import CreateSite from "../site/CreateSite.vue";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";

export default {
  components: { Popup, CreateSite },
  emits: ["created"],
  setup(props, { emit }) {
    const first_name = ref("");
    const last_name = ref("");
    const company = ref("");
    const address = ref("");
    const city = ref("");
    const postal_code = ref("");
    const phone = ref("");
    const email = ref("");
    const client_type = ref("");
    const status = ref("actif");
    const selectedSiteId = ref("");
    const sites = ref([]);
    const showSitePopup = ref(false);
    const toast = useToast();

    const fetchSites = async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/site`, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
        sites.value = await response.json();
      } catch (error) {
        toast.error("Erreur lors du chargement des sites.");
      }
    };

    onMounted(fetchSites);

    const createClient = async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/client/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              first_name: first_name.value,
              last_name: last_name.value,
              company: company.value,
              address: address.value,
              city: city.value,
              postal_code: postal_code.value,
              phone: phone.value,
              email: email.value,
              client_type: client_type.value,
              status: status.value,
              site_id: selectedSiteId.value,
            }),
          }
        );

        if (response.ok) {
          toast.success("Client créé avec succès !");
          resetForm();

          emit("created");
        } else {
          const errorData = await response.json();
          toast.error(`Erreur : ${errorData.message || "Création échouée"}`);
        }
      } catch (error) {
        toast.error("Erreur de connexion au serveur.");
      }
    };

    const resetForm = () => {
      first_name.value = "";
      last_name.value = "";
      company.value = "";
      address.value = "";
      city.value = "";
      postal_code.value = "";
      phone.value = "";
      email.value = "";
      client_type.value = "";
      status.value = "actif";
      selectedSiteId.value = "";
    };

    const openCreateSite = () => {
      showSitePopup.value = true;
    };

    const closeSitePopup = () => {
      showSitePopup.value = false;
      fetchSites();
    };

    return {
      first_name,
      last_name,
      company,
      address,
      city,
      postal_code,
      phone,
      email,
      client_type,
      status,
      selectedSiteId,
      sites,
      showSitePopup,
      createClient,
      openCreateSite,
      closeSitePopup,
    };
  },
};
</script>



<style scoped>
.form-container {
  max-height: 70vh;
  overflow-y: auto;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
  margin-bottom: 20px;
}

.site-select-container {
  display: flex;
  align-items: center;
}

.site-select-container select {
  margin-bottom: unset;
}

.add-site-button {
  margin-left: 10px;
}

button {
  margin-top: unset;
}
</style>
