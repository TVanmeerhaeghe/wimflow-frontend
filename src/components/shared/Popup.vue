<template>
    <div v-if="show" class="popup-overlay">
      <div class="popup-content">
        <slot></slot>
        <button class="close-btn" @click="closePopup">Fermer</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      closePopup() {
        this.$emit('close');
      }
    }
  };
  </script>
  
<style scoped>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-content {
    background: white;
    padding: 20px 50px;
    border-radius: 10px;
    width: 550px;
  }
  
  .close-btn {
    margin-top: 20px;
    background-color: #80d1cc;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .close-btn:hover {
    background-color: #008f82;
  }
</style>
  