<template>
    <div class="header">
      <img src="/path/to/logo.png" alt="Logo" class="logo" />
      <div class="account-options">
        <router-link to="/profile">Mon compte</router-link>
        <button @click="logout">Se déconnecter</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/');
      },
    },
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background-color: #00c9bd;
    color: white;
    height: 80px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    height: 60px;
  }
  
  .account-options {
    display: flex;
    gap: 30px;
  }
  
  .account-options a {
    color: white;
    text-decoration: none;
    font-weight: 600;
  }
  
  .account-options a:hover {
    text-decoration: underline;
  }
  
  button {
    background-color: transparent;
    color: white;
    border: 2px solid white;
    padding: 8px 16px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  button:hover {
    background-color: white;
    color: #00c9bd;
  }
  </style>
  