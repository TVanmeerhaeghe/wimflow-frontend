<template>
    <div class="users-list">
      <h1>Liste des utilisateurs</h1>
      <table>
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const users = ref([]);
  
      onMounted(async () => {
        try {
          const response = await fetch(`${process.env.VUE_APP_API_URL}/user`, {
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            },
          });
          users.value = await response.json();
        } catch (error) {
          console.error('Erreur lors de la récupération des utilisateurs', error);
        }
      });
  
      return {
        users,
      };
    },
  };
  </script>
  
  <style scoped>
  .users-list {
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #00c9bd;
    color: white;
  }
  
  tr:hover {
    background-color: #f1f1f1;
  }
  </style>
  