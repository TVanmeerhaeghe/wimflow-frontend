<template>
    <div class="invoice-list">
        <h1>Liste des Factures</h1>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Total HT (€)</th>
                    <th>Total TVA (€)</th>
                    <th>Date de Création</th>
                    <th>Date de Validité</th>
                    <th>Statut</th>
                    <th>Objet</th>
                    <th>Marge HT (€)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="invoice in invoices" :key="invoice.id" @click="showPreview(invoice)">
                    <td><a class="clickable-id">{{ invoice.id }}</a></td>
                    <td>{{ invoice.Client?.company }}</td>
                    <td>{{ Number(invoice.total_ht || 0).toFixed(2) }}</td>
                    <td>{{ Number(invoice.total_tva || 0).toFixed(2) }}</td>
                    <td>{{ new Date(invoice.creation_date).toLocaleDateString() }}</td>
                    <td>{{ new Date(invoice.due_date).toLocaleDateString() }}</td>
                    <td>{{ invoice.status }}</td>
                    <td>{{ invoice.object }}</td>
                    <td>{{ Number(invoice.margin_ht || 0).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>

        <button @click="goToCreateInvoice" class="create-invoice-button">Créer une facture</button>

        <InvoicePreview v-if="selectedInvoice" :invoice="selectedInvoice" @close="closePreview" @edit="editInvoice" />
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import InvoicePreview from './InvoicePreview.vue';

export default {
    components: { InvoicePreview },
    setup() {
        const invoices = ref([]);
        const selectedInvoice = ref(null);
        const router = useRouter();

        const goToCreateInvoice = () => {
            router.push("/admin/invoice/create");
        };

        const showPreview = (invoice) => {
            selectedInvoice.value = invoice;
        };

        const closePreview = () => {
            selectedInvoice.value = null;
        };

        const editInvoice = (invoice) => {
            router.push(`/admin/invoice/edit/${invoice.id}`);
        };

        onMounted(async () => {
            const response = await fetch(`${process.env.VUE_APP_API_URL}/invoice`, {
                headers: {
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
            invoices.value = await response.json();
        });

        return {
            invoices,
            selectedInvoice,
            goToCreateInvoice,
            showPreview,
            closePreview,
            editInvoice,
        };
    },
};
</script>

<style scoped>
.create-invoice-button {
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

.create-invoice-button:hover {
    background-color: #008f82;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #80d1cc;
    color: white;
}

.clickable-id {
    cursor: pointer;
}

.clickable-id:hover {
    text-decoration: underline;
}
</style>
