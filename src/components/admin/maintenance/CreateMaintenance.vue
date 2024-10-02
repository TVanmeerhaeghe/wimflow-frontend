<template>
<div class="create-maintenance">
    <h1>Ajouter une maintenance</h1>
    <form @submit.prevent="handleSubmit">
    <div class="form-group">
        <label for="site">Sélectionner un site</label>
        <select id="site" v-model="selectedSite" required>
        <option v-for="site in sites" :key="site.id" :value="site.id">
            {{ site.name }}
        </option>
        </select>
    </div>
    <div class="form-group">
        <label for="nextMaintenance">Prochaine date de maintenance</label>
        <input type="date" id="nextMaintenance" v-model="nextMaintenance" required />
    </div>
    <button type="submit">Ajouter la maintenance</button>
    </form>
</div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
setup() {
    const sites = ref([]);
    const selectedSite = ref('');
    const nextMaintenance = ref('');

    // Récupérer la liste des sites
    onMounted(async () => {
    try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance/sites`, {
        headers: {
            Authorization: `${localStorage.getItem('token')}`,
        },
        });
        sites.value = await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des sites', error);
    }
    });

    const handleSubmit = async () => {
    try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance/maintenance/${selectedSite.value}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            next_maintenance: nextMaintenance.value,
        }),
        });

        if (response.ok) {
        alert('Maintenance ajoutée avec succès');
        selectedSite.value = '';
        nextMaintenance.value = '';
        } else {
        alert('Erreur lors de l\'ajout de la maintenance');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la maintenance', error);
    }
    };

    return {
    sites,
    selectedSite,
    nextMaintenance,
    handleSubmit
    };
}
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
