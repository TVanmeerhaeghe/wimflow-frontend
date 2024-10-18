<template>
    <div class="estimate-preview-overlay">
        <div class="estimate-preview-content">
            <div class="action-buttons">
                <button @click="emitEvent('edit', estimate)" class="edit-button" title="Modifier">✏️</button>
                <button @click="emitEvent('download', estimate)" class="pdf-button"
                    title="Télécharger en PDF">📄</button>
                <button class="invoice-button" title="Transformer en Facture">💼</button>
                <button @click="emitEvent('close')" class="close-button" title="Fermer">❌</button>
            </div>

            <div class="estimate-header">
                <h1>{{ estimate.id }}</h1>
                <div class="infos">
                    <CompanyInfo />
                    <div class="client-info">
                        <p><strong>Destinataire :</strong> {{ estimate.Client?.company }}</p>
                        <p><strong>Date de devis :</strong> {{ new Date(estimate.creation_date).toLocaleDateString() }}
                        </p>
                        <p><strong>Date de validité :</strong> {{ new Date(estimate.validity_date).toLocaleDateString()
                            }}</p>
                    </div>
                </div>
                <p><strong>Objet :</strong> {{ estimate.object }}</p>
            </div>

            <TaskList :estimateId="estimate.id" @updateTotals="updateTotals" />

            <div class="totals">
                <p><strong>Total HT :</strong> {{ totalHT.toFixed(2) }} €</p>
                <p><strong>TVA :</strong> {{ totalTVA.toFixed(2) }} €</p>
                <p><strong>Total TTC :</strong> {{ (totalHT + totalTVA).toFixed(2) }} €</p>
            </div>

            <!-- <div class="footer-info">
                <p><strong>Conditions Générales de Vente</strong></p>
                <p>{{ estimate.general_sales_conditions }}</p>
            </div> -->
        </div>
    </div>
</template>

<script>
import TaskList from '../task/TaskList.vue';
import CompanyInfo from '../CompanyInfo.vue';

export default {
    props: {
        estimate: Object,
    },
    components: {
        CompanyInfo,
        TaskList,
    },
    data() {
        return {
            totalHT: 0,
            totalTVA: 0,
        };
    },
    methods: {
        updateTotals({ totalHT, totalTVA }) {
            this.totalHT = totalHT;
            this.totalTVA = totalTVA;
        },
        emitEvent(event, data = null) {
            this.$emit(event, data);
        }
    }
};
</script>

<style scoped>
.estimate-preview-overlay {
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background-color: white;
    box-shadow: -4px 0 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    overflow-y: auto;
    z-index: 1000;
}

.estimate-preview-content {
    max-width: 90%;
    margin: 0 auto;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.action-buttons button {
    background-color: #80d1cc;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
}

.action-buttons button:hover {
    background-color: #008f82;
    transition: background-color 0.3s ease;
}

.estimate-header {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin-bottom: 20px;
}

.infos {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.company-info,
.client-info {
    font-size: 14px;
}

.tasks-list {
    margin-top: 20px;
}

.tasks-list table {
    width: 100%;
    border-collapse: collapse;
}

.tasks-list th,
.tasks-list td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.totals {
    font-weight: bold;
    margin-top: 20px;
    text-align: right;
}

.footer-info {
    margin-top: 40px;
    font-size: 12px;
}
</style>
