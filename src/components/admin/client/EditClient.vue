<template>
    <div>
        <h1>Modifier le client</h1>
        <form @submit.prevent="updateClient" class="form-container">
            <div class="form-row">
                <div class="form-group">
                    <label for="last_name">Nom</label>
                    <input type="text" v-model="client.last_name" />
                </div>
                <div class="form-group">
                    <label for="first_name">Prénom</label>
                    <input type="text" v-model="client.first_name" />
                </div>
            </div>

            <div class="form-group">
                <label for="company">Entreprise</label>
                <input type="text" v-model="client.company" required />
            </div>

            <div class="form-group">
                <label for="site">Site associé</label>
                <select v-model="selectedSiteId">
                    <option value="" disabled>Choisir un site</option>
                    <option v-for="site in sites" :key="site.id" :value="site.id">
                        {{ site.name }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label for="address">Adresse</label>
                <input type="text" v-model="client.address" required />
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="postal_code">Code Postal</label>
                    <input type="text" v-model="client.postal_code" required />
                </div>
                <div class="form-group">
                    <label for="city">Ville</label>
                    <input type="text" v-model="client.city" required />
                </div>
            </div>

            <button type="submit">Sauvegarder</button>
        </form>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
    setup() {
        const client = ref({
            first_name: "",
            last_name: "",
            company: "",
            address: "",
            city: "",
            postal_code: "",
        });
        const selectedSiteId = ref("");
        const sites = ref([]);
        const route = useRoute();
        const router = useRouter();

        const fetchClientData = async () => {
            try {
                const clientResponse = await fetch(`${process.env.VUE_APP_API_URL}/client/${route.params.id}`, {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });
                client.value = await clientResponse.json();

                const siteResponse = await fetch(`${process.env.VUE_APP_API_URL}/site`, {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });
                sites.value = await siteResponse.json();

                selectedSiteId.value = client.value.site_id || "";
            } catch (error) {
                console.error("Erreur lors de la récupération des données du client", error);
            }
        };

        onMounted(fetchClientData);

        const updateClient = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/client/modify/${route.params.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        ...client.value,
                        site_id: selectedSiteId.value,
                    }),
                });

                if (response.ok) {
                    alert("Client mis à jour avec succès");
                    router.push("/admin/clients");
                } else {
                    alert("Erreur lors de la mise à jour du client");
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour du client", error);
            }
        };

        return {
            client,
            selectedSiteId,
            sites,
            updateClient,
        };
    },
};
</script>

<style scoped>
.form-container {
    max-height: 70vh;
    overflow-y: auto;
}

.form-row {
    display: flex;
    gap: 20px;
}

.form-group {
    flex: 1;
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
