<template>
  <div class="edit-site">
    <h1>Modifier le site</h1>
    <form @submit.prevent="updateSite">
      <div class="form-group">
        <label for="name">Nom du site</label>
        <input type="text" id="name" v-model="site.name" required />
      </div>
      <div class="form-group">
        <label for="url">URL du site</label>
        <input type="text" id="url" v-model="site.url" required />
      </div>
      <div class="form-group">
        <label for="email_maintenance">Email de maintenance</label>
        <input type="email" id="email_maintenance" v-model="site.email_maintenance" required />
      </div>
      <div class="form-group">
        <label for="maintenance_status">Statut de la maintenance</label>
        <select v-model="site.maintenance_status" required>
          <option :value="true">Activée</option>
          <option :value="false">Désactivée</option>
        </select>
      </div>
      <button type="submit">Mettre à jour</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  setup() {
    const site = ref({});
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    onMounted(async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/site/${route.params.id}`, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
        site.value = await response.json();
      } catch (error) {
        console.error("Erreur lors de la récupération du site :", error);
        toast.error("Erreur lors du chargement des informations du site.");
      }
    });

    const updateSite = async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/site/modify/${route.params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(site.value),
        });

        if (response.ok) {
          toast.success("Site mis à jour avec succès.");
          router.push("/admin/sites");
        } else {
          toast.error("Erreur lors de la mise à jour du site.");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du site :", error);
        toast.error("Erreur lors de la mise à jour du site.");
      }
    };

    return { site, updateSite };
  },
};
</script>


<style scoped>
.form-group {
  margin-bottom: 20px;
}

button {
  background-color: #80d1cc;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #008f82;
}
</style>
