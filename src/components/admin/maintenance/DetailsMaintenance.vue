<template>
  <div class="maintenance-details">
    <h1>Détails de la maintenance</h1>

    <div v-if="maintenance">
      <p><strong>Site :</strong> {{ maintenance.Site.name }}</p>
      <p  :class="statusSelectClass(maintenance.status)">
        <strong>Statut :</strong>
        <select v-model="maintenance.status" @change="updateStatus(maintenance)">
          <option value="to_do">À faire</option>
          <option value="done">Terminé</option>
        </select>
      </p>
      <p><strong>Prochaine maintenance :</strong> {{ formatDate(maintenance.next_maintenance) }}</p>
      <p><strong>Dernière maintenance :</strong> {{ formatDate(maintenance.last_maintenance) || 'Aucune' }}</p>
    </div>

    <div class="notes-section">
      <h2>Notes</h2>
      <ul>
        <li v-for="note in notes" :key="note.id">
          <strong>{{ note.User?.username || 'Utilisateur inconnu' }} ({{ formatDate(note.date) }})</strong> :
          {{ note.content }}
        </li>
      </ul>

      <form @submit.prevent="addNote">
        <textarea v-model="newNote" placeholder="Ajouter une note"></textarea>
        <button type="submit" class="add-note-button">Ajouter</button>
      </form>
    </div>
  </div>
</template>

  
<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const maintenance = ref(null);
    const notes = ref([]);
    const newNote = ref("");
    const route = useRoute();

    onMounted(async () => {
      const maintenanceResponse = await fetch(`${process.env.VUE_APP_API_URL}/maintenance/${route.params.id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      maintenance.value = await maintenanceResponse.json();

      const notesResponse = await fetch(`${process.env.VUE_APP_API_URL}/note/maintenance/${route.params.id}/notes`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      notes.value = await notesResponse.json();
    });

    const addNote = async () => {
      await fetch(`${process.env.VUE_APP_API_URL}/note/maintenance/${route.params.id}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: newNote.value }),
      });

      const notesResponse = await fetch(`${process.env.VUE_APP_API_URL}/note/maintenance/${route.params.id}/notes`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      notes.value = await notesResponse.json();
      newNote.value = "";
    };

    const updateStatus = async (maintenance) => {
      try {
        await fetch(`${process.env.VUE_APP_API_URL}/maintenance/modify/${maintenance.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: maintenance.status }),
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut", error);
      }
    };

    const formatDate = (date) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString();
    };

    const statusSelectClass = (status) => {
      return {
        'status-to-do': status === 'to_do',
        'status-done': status === 'done',
      };
    };

    return {
      maintenance,
      notes,
      newNote,
      addNote,
      formatDate,
      updateStatus,
      statusSelectClass,
    };
  },
};
</script>

  
  <style scoped>
  .maintenance-details {
    padding: 20px;
  }
  
  .notes-section {
    margin-top: 20px;
  }
  
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
  }

.add-note-button {
  background-color: #80d1cc;
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 50px;
  width: 250px;
  position: relative;
  left: 82%;
}
  
  button:hover {
    background-color: #008f82;
  }
  </style>
  