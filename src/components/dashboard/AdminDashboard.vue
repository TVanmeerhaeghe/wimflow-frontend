<template>
  <div class="admin-layout">
    <Sidebar />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from '../admin/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
}

.content {
  margin-left: 250px;
  padding: 20px;
  width: 100%;
}
</style>
  