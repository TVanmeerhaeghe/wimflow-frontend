import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import './assets/global.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
    position: "top-right",
    timeout: 3500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
};

const app = createApp(App);

app.use(router);
app.use(Toast, options);

app.mount('#app');
