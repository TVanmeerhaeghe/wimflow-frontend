<template>
    <div class="estimate-preview-overlay">
        <div>
            <div class="actions">
                <div class="status-container">
                    <p class="status-text">{{ estimate.status }}</p>
                </div>
                <div class="action-buttons">
                    <button @click="emitEvent('edit', estimate)" class="edit-button" title="Modifier">✏️</button>
                    <button @click="generatePDF" class="pdf-button" title="Télécharger en PDF">📄</button>
                    <button @click="transformToInvoice" class="invoice-button"
                        title="Transformer en Facture">💼</button>
                    <button @click="sendEmail" class="email-button" title="Envoyer par email">📧</button>
                    <button @click="emitEvent('close')" class="close-button" title="Fermer">❌</button>
                </div>
            </div>

            <div class="estimate-preview-content" ref="pdfContent">
                <div class="estimate-header">
                    <h1>{{ estimate.id }}</h1>
                    <div class="infos">
                        <CompanyInfo />
                        <div class="client-info">
                            <p><strong>Destinataire :</strong> {{ estimate.Client?.company }}</p>
                            <p><strong>Date de création :</strong> {{ formatDate(estimate.creation_date) }}</p>
                            <p><strong>Date de validité :</strong> {{ formatDate(estimate.validity_date) }}</p>
                        </div>
                    </div>
                    <p><strong>Objet :</strong> {{ estimate.object }}</p>
                </div>

                <TaskList :estimateId="estimate.id" type="estimate" @updateTotals="updateTotals" />

                <div class="totals">
                    <p><strong>Total HT :</strong> {{ totalHT.toFixed(2) }} €</p>
                    <p><strong>TVA :</strong> {{ totalTVA.toFixed(2) }} €</p>
                    <p><strong>Total TTC :</strong> {{ (totalHT + totalTVA).toFixed(2) }} €</p>
                </div>

                <CompanyTerms />
            </div>
        </div>
    </div>
</template>

<script>
import TaskList from '../task/TaskList.vue';
import CompanyInfo from '../CompanyInfo.vue';
import CompanyTerms from '../CompanyTerms.vue';
import html2pdf from 'html2pdf.js';
import { useToast } from "vue-toastification";

export default {
    props: {
        estimate: Object,
    },
    components: {
        CompanyInfo,
        TaskList,
        CompanyTerms,
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
            if (event === 'edit') {
                this.$router.push(`/admin/estimate/edit/${data.id}`);
            } else {
                this.$emit(event, data);
            }
        },
        generatePDF() {
            const element = this.$refs.pdfContent;
            const opt = {
                margin: [1, 0, 0, 0],
                filename: `Devis_${this.estimate.id}_Wimersion.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                this.toast.success("PDF téléchargé avec succès !");
            }).catch(() => {
                this.toast.error("Erreur lors de la génération du PDF.");
            });
        },
        async generatePDFForEmail() {
            const element = this.$refs.pdfContent;
            const opt = {
                margin: [1, 0, 0, 0],
                filename: `Devis_${this.estimate.id}_Wimersion.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            return new Promise((resolve, reject) => {
                html2pdf()
                    .set(opt)
                    .from(element)
                    .outputPdf('datauristring')
                    .then(resolve)
                    .catch(reject);
            });
        },
        async sendEmail() {
            try {
                const pdfBase64 = await this.generatePDFForEmail();

                const response = await fetch(`${process.env.VUE_APP_API_URL}/estimate/send-email/${this.estimate.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ pdfBase64 }),
                });

                if (response.ok) {
                    this.toast.success("Devis envoyé par email avec succès.");
                } else {
                    const errorData = await response.json();
                    this.toast.error(`Erreur lors de l'envoi : ${errorData.message}`);
                }
            } catch (error) {
                this.toast.error("Erreur de connexion lors de l'envoi de l'email.");
            }
        },
        transformToInvoice() {
            this.toast.info("Fonctionnalité en cours de développement.");
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        }
    },
    setup() {
        const toast = useToast();
        return { toast };
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

.actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

.client-info {
    font-size: 14px;
}

.totals {
    font-weight: bold;
    margin-top: 20px;
    text-align: right;
}

.status-container {
    border: 2px solid #80d1cc;
    padding: 10px;
    border-radius: 5px;
    display: inline-block;
}

.status-text {
    color: #80d1cc;
    font-weight: bold;
    margin: 0;
}
</style>
