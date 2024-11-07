<template>
  <div class="sidebar">
    <ul class="menu">
      <li>
        <router-link to="/admin">Dashboard</router-link>
      </li>
      <li>
        <router-link to="/admin/clients">Clients</router-link>
      </li>
      <li>
        <router-link to="/admin/sites">Sites</router-link>
      </li>
      <li @click="toggleDropdown" class="dropdown">
        <span>Administratif</span>
        <ul v-if="dropdownOpen" class="submenu">
          <li>
            <router-link to="/admin/estimate">Devis</router-link>
          </li>
          <li>
            <router-link to="/admin/invoice">Factures</router-link>
          </li>
        </ul>
      </li>
      <li>
        <router-link to="/admin/project">Projets</router-link>
      </li>
      <li>
        <router-link to="/admin/maintenances">Maintenances</router-link>
      </li>
      <li>
        <router-link to="/admin/users">Collaborateurs</router-link>
      </li>
      <li>
        <router-link to="/admin/settings">Paramètres</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      dropdownOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 150px;
  background-color: #80d1cc;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.dropdown {
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.submenu {
  list-style-type: none;
  padding-left: 20px;
  margin-top: 10px;
}

.submenu li a {
  color: #e0f7fa;
  text-decoration: none;
}

.submenu li a:hover {
  text-decoration: underline;
}
</style>
