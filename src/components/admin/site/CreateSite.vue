<template>
  <div>
    <h1>Créer un site</h1>
    <form @submit.prevent="createSite">
      <div class="form-group">
        <label for="name">Nom du site</label>
        <input type="text" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="url">URL du site</label>
        <input type="text" v-model="url" required />
      </div>
      <div class="form-group">
        <label for="email_maintenance">Email du gestionnaire de maintenance</label>
        <input type="email" v-model="email_maintenance" required />
      </div>
      <button type="submit">Créer</button>
    </form>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  setup() {
    const toast = useToast();
    const name = "";
    const url = "";
    const email_maintenance = "";

    const createSite = async () => {
      try {
        const formattedUrl = url.value.startsWith("http") ? url.value : `https://${url.value}`;
        const response = await fetch(`${process.env.VUE_APP_API_URL}/site/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: name.value,
            url: formattedUrl,
            email_maintenance: email_maintenance.value,
          }),
        });

        if (response.ok) {
          toast.success("Site créé avec succès.");
          name.value = "";
          url.value = "";
          email_maintenance.value = "";
        } else {
          toast.error("Erreur lors de la création du site.");
        }
      } catch (error) {
        console.error("Erreur lors de la création du site :", error);
        toast.error("Erreur lors de la création du site.");
      }
    };

    return { name, url, email_maintenance, createSite };
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
