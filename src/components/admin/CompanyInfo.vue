<template>
    <div class="company-info" v-if="company">
        <h3>{{ company.name }}</h3>
        <p>{{ company.address }}</p>
        <p>{{ company.postal_code }} {{ company.city }}</p>
        <p>{{ company.phone }}</p>
    </div>
    <div v-else>
        <p>Chargement des informations...</p>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'CompanyInfo',
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
.company-info {
    font-size: 14px;
}
</style>
