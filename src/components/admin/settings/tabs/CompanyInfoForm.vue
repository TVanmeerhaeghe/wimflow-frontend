<template>
    <form @submit.prevent="saveCompanyInfo">
        <div>
            <label>Nom de l'entreprise:</label>
            <input v-model="company.name" type="text" required />
        </div>
        <div>
            <label>Adresse:</label>
            <input v-model="company.address" type="text" required />
        </div>
        <div>
            <label>Ville:</label>
            <input v-model="company.city" type="text" required />
        </div>
        <div>
            <label>Code Postal:</label>
            <input v-model="company.postal_code" type="text" required />
        </div>
        <div>
            <label>Code Pays:</label>
            <input v-model="company.country_code" type="text" required />
        </div>
        <div>
            <label>Téléphone:</label>
            <input v-model="company.phone" type="text" required />
        </div>
        <div>
            <label>TVA:</label>
            <input v-model="company.vat_number" type="text" />
        </div>
        <div>
            <label>Informations de paiement:</label>
            <textarea v-model="company.payment_info"></textarea>
        </div>
        <div>
            <label>Conditions générales de vente:</label>
            <textarea v-model="company.general_sales_conditions"></textarea>
        </div>
        <button type="submit">Enregistrer</button>
    </form>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

export default {
    name: 'CompanyInfoForm',
    setup() {
        const company = ref({
            name: '',
            address: '',
            city: '',
            postal_code: '',
            country_code: '',
            phone: '',
            vat_number: '',
            payment_info: '',
            general_sales_conditions: '',
        });

        const toast = useToast();

        const fetchCompanyInfo = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/company-info/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur serveur');
                }

                const data = await response.json();
                company.value = data;
            } catch (error) {
                console.error('Erreur lors de la récupération des infos de l\'entreprise', error);
                toast.error('Erreur lors de la récupération des informations de l\'entreprise.');
            }
        };

        const saveCompanyInfo = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/company-info/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(company.value),
                });

                if (response.ok) {
                    toast.success('Informations enregistrées avec succès.');
                } else {
                    console.error('Erreur lors de la sauvegarde des infos de l\'entreprise');
                    toast.error('Erreur lors de la sauvegarde des informations de l\'entreprise.');
                }
            } catch (error) {
                console.error('Erreur lors de la sauvegarde des infos de l\'entreprise', error);
                toast.error('Erreur lors de la sauvegarde des informations de l\'entreprise.');
            }
        };

        onMounted(fetchCompanyInfo);

        return {
            company,
            saveCompanyInfo,
        };
    },
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

form div {
    display: flex;
    flex-direction: column;
}

button {
    background-color: #80d1cc;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    width: 250px;
    position: relative;
    left: 82%;
}

button:hover {
    background-color: #008f82;
}
</style>
