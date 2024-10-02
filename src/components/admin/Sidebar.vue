<template>
    <div class="sidebar">
      <ul class="menu">
        <li>
          <router-link to="/admin/dashboard">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/admin/users">Utilisateurs</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "Sidebar",
  };
  </script>