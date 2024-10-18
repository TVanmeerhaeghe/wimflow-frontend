<template>
    <div class="footer-info" v-if="company">
        <p><strong>Informations de Paiement</strong></p>
        <p>{{ company.payment_info }}</p>

        <p class="terms-top"><strong>Conditions Générales de Vente</strong></p>
        <p>{{ company.general_sales_conditions }}</p>
    </div>
    <div v-else>
        <p>Chargement des informations...</p>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'CompanyTerms',
    setup() {
        const company = ref(null);

        const fetchCompanyInfo = async () => {
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/company-info`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${localStorage.getItem('token')}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    company.value = data;
                } else {
                    console.error('Erreur lors de la récupération des informations de l\'entreprise');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de l\'entreprise', error);
            }
        };

        onMounted(fetchCompanyInfo);

        return {
            company,
        };
    },
};
</script>

<style scoped>
.footer-info {
    margin-top: 40px;
    font-size: 12px;
}

.terms-top {
    margin-top: 20px;
}
</style>