<template>
    <div>
        <h1>Fichiers du Projet</h1>
        <table>
            <thead>
                <tr>
                    <th>Nom du fichier</th>
                    <th>Date d'upload</th>
                    <th class="td-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="file in files" :key="file.id">
                    <td>{{ file.filename }}</td>
                    <td>{{ new Date(file.uploaded_at).toLocaleDateString('fr-FR') }}</td>
                    <td class="file-button">
                        <button @click="downloadFile(file.id, file.filename)">📥 Télécharger</button>
                        <button @click="deleteFile(file.id)">🗑️ Supprimer</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="upload-section">
            <input type="file" hidden ref="fileInput" @change="handleFileChange">
            <div class="drop-zone" @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="handleDrop">
                Déposez les fichiers ici ou cliquez pour sélectionner
            </div>
            <button class="upload-button" @click="uploadFile" v-if="selectedFile">Uploader</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const projectId = route.params.id;
const files = ref([]);
const selectedFile = ref(null);

const fetchFiles = async () => {
    try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/project/project-file/${projectId}`, {
            headers: { Authorization: localStorage.getItem("token") },
        });
        if (res.ok) files.value = await res.json();
        else throw new Error("Erreur lors du chargement des fichiers");
    } catch (error) {
        console.error(error);
    }
};

const handleFileChange = (e) => {
    selectedFile.value = e.target.files[0];
};

const uploadFile = async () => {
    if (!selectedFile.value) return;
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/project/project-file/${projectId}/upload`, {
            method: 'POST',
            headers: { Authorization: localStorage.getItem("token") },
            body: formData,
        });
        if (res.ok) {
            fetchFiles();
            selectedFile.value = null;
        } else {
            throw new Error("Erreur lors de l'upload");
        }
    } catch (error) {
        console.error(error);
    }
};

const downloadFile = async (fileId, filename) => {
    try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/project/project-file/download/${fileId}`, {
            method: "GET",
            headers: { Authorization: localStorage.getItem("token") },
        });

        if (!res.ok) throw new Error("Erreur lors du téléchargement");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);
        alert("Erreur lors du téléchargement du fichier.");
    }
};

const deleteFile = async (fileId) => {
    try {
        const res = await fetch(`${process.env.VUE_APP_API_URL}/project/project-file/${fileId}`, {
            method: 'DELETE',
            headers: { Authorization: localStorage.getItem("token") },
        });
        if (res.ok) {
            fetchFiles();
        } else {
            throw new Error("Erreur lors de la suppression");
        }
    } catch (error) {
        console.error(error);
    }
};

onMounted(fetchFiles);
</script>

<style scoped>
.upload-section {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.upload-button {
    background-color: #80d1cc;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    margin-top: 10px;
    width: 250px;
}

.upload-button:hover {
    background-color: #008f82;
}

.drop-zone {
    margin-top: 20px;
    padding: 20px;
    border: 2px dashed #80d1cc;
    text-align: center;
    border-radius: 10px;
    cursor: pointer;
    width: 50%;
}

.td-center {
    text-align: center;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.file-button {
    display: flex;
    gap: 50px;
}

th,
td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

th {
    background-color: #80d1cc;
    color: white;
}
</style>