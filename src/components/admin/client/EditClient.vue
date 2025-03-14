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
                <label for="phone">Téléphone</label>
                <input type="text" v-model="client.phone" />
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" v-model="client.email" />
            </div>

            <div class="form-group">
                <label for="client_type">Type de Client</label>
                <select v-model="client.client_type">
                    <option value="" disabled>Choisir un type</option>
                    <option value="Individuel">Individuel</option>
                    <option value="Entreprise">Entreprise</option>
                    <option value="Organisation">Organisation</option>
                </select>
            </div>

            <div class="form-group">
                <label for="status">Statut</label>
                <select v-model="client.status">
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                </select>
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
import { useToast } from "vue-toastification";

export default {
    setup() {
        const client = ref({
            first_name: "",
            last_name: "",
            company: "",
            address: "",
            city: "",
            postal_code: "",
            phone: "",
            email: "",
            client_type: "",
            status: "actif",
        });
        const selectedSiteId = ref("");
        const sites = ref([]);
        const route = useRoute();
        const router = useRouter();
        const toast = useToast();

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
                toast.error("Erreur lors de la récupération des données.");
                console.error(error);
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
                    toast.success("Client mis à jour avec succès !");
                    router.push("/admin/clients");
                } else {
                    const errorData = await response.json();
                    toast.error(`Erreur : ${errorData.message || "Mise à jour échouée"}`);
                }
            } catch (error) {
                toast.error("Erreur de connexion au serveur.");
                console.error(error);
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
    /* Suppression du scroll limité */
    max-width: 100%;
    overflow: visible;
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
