<template>
<div class="sidebar">
  <ul class="menu">
    <li>
      <router-link to="/admin/dashboard">Dashboard</router-link>
    </li>
    <li>
      <router-link to="/admin/users">Utilisateurs</router-link>
    </li>
    <li>
      <router-link to="/admin/sites">Sites</router-link>
    </li>
    <li>
      <router-link to="/admin/maintenances">Maintenances</router-link>
    </li>
  </ul>
</div>
</template>

<script>
export default {
name: "Sidebar",
};
</script>

<style scoped>
.sidebar {
height: 100vh;
width: 150px;
background-color: #00c9bd;
padding: 20px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
position: fixed;
top: 0;
left: 0;
}

.menu {
list-style-type: none;
padding: 0;
}

.menu li {
margin-bottom: 20px;
}

.menu li a {
color: white;
text-decoration: none;
font-weight: bold;
}

.menu li a:hover {
text-decoration: underline;
}
</style>
