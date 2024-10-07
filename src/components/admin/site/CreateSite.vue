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
        <label for="email_maintenance"
          >Email du gestionnaire de maintenance</label
        >
        <input type="email" v-model="email_maintenance" required />
      </div>
      <button type="submit">Créer</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      url: "",
      email_maintenance: "",
    };
  },
  methods: {
    async createSite() {
      const response = await fetch(
        `${process.env.VUE_APP_API_URL}/site/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: this.name,
            url: this.url,
            email_maintenance: this.email_maintenance,
          }),
        }
      );

      if (response.ok) {
        alert("Site créé avec succès");
      } else {
        alert("Erreur lors de la création du site");
      }
    },
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
