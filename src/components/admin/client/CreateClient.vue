<template>
    <div>
      <h1>Créer un client</h1>
      <form @submit.prevent="createClient">
        <div class="form-group">
          <label for="first_name">Prénom</label>
          <input type="text" v-model="first_name" />
        </div>
        <div class="form-group">
          <label for="last_name">Nom</label>
          <input type="text" v-model="last_name" />
        </div>
        <div class="form-group">
          <label for="company">Entreprise</label>
          <input type="text" v-model="company" required />
        </div>
        <div class="form-group">
          <label for="address">Adresse</label>
          <input type="text" v-model="address" required />
        </div>
        <div class="form-group">
          <label for="city">Ville</label>
          <input type="text" v-model="city" required />
        </div>
        <div class="form-group">
          <label for="postal_code">Code Postal</label>
          <input type="text" v-model="postal_code" required />
        </div>
        <button type="submit">Créer</button>
      </form>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        first_name: '',
        last_name: '',
        company: '',
        address: '',
        city: '',
        postal_code: '',
      };
    },
    methods: {
      async createClient() {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/client/create`, {
          method: 'POST',
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: this.first_name,
            last_name: this.last_name,
            company: this.company,
            address: this.address,
            city: this.city,
            postal_code: this.postal_code,
          }),
        });
  
        if (response.ok) {
          alert('Client créé avec succès');
        } else {
          alert('Erreur lors de la création du client');
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
  