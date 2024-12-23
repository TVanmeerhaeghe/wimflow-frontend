<template>
    <div class="date-format-settings">
        <h2>Paramètres du format de date</h2>
        <p>Choisissez le format de date à utiliser :</p>
        <div class="options">
            <label>
                <input type="radio" value="fr" v-model="selectedFormat" @change="saveFormat" />
                Français (dd/MM/yyyy)
            </label>
            <label>
                <input type="radio" value="us" v-model="selectedFormat" @change="saveFormat" />
                Américain (MM/dd/yyyy)
            </label>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    name: "DateFormatSettings",
    setup() {
        const selectedFormat = ref('fr');

        const saveFormat = () => {
            localStorage.setItem('dateFormat', selectedFormat.value);
        };

        const loadFormat = () => {
            const savedFormat = localStorage.getItem('dateFormat');
            if (savedFormat) {
                selectedFormat.value = savedFormat;
            }
        };

        onMounted(loadFormat);

        return {
            selectedFormat,
            saveFormat,
        };
    },
};
</script>

<style scoped>
.date-format-settings {
    padding: 20px;
    font-family: Arial, sans-serif;
}

.options {
    margin-top: 10px;
}

label {
    display: block;
    margin-bottom: 10px;
}
</style>
