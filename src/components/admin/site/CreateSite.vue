<template>
<div class="create-site">
    <h1>Ajouter un nouveau site</h1>
    <form @submit.prevent="handleSubmit">
    <div class="form-group">
        <label for="name">Nom du site</label>
        <input type="text" id="name" v-model="name" required />
    </div>
    <div class="form-group">
        <label for="url">URL du site</label>
        <input type="text" id="url" v-model="url" required />
    </div>
    <button type="submit">Ajouter le site</button>
    </form>
</div>
</template>

<script>
import { ref } from 'vue';

export default {
setup() {
    const name = ref('');
    const url = ref('');

    const handleSubmit = async () => {
    try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance/site`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            name: name.value,
            url: url.value,
        }),
        });

        if (response.ok) {
        alert('Site ajouté avec succès');
        name.value = '';
        url.value = '';
        } else {
        alert('Erreur lors de l\'ajout du site');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du site', error);
    }
    };

    return {
    name,
    url,
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
background-color: #00c9bd;
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
