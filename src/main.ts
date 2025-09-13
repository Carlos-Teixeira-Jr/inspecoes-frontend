import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';

import './style.css'; // Tailwind
import 'leaflet/dist/leaflet.css';

import 'primeicons/primeicons.css'; // Ícones PrimeVue

import Lara from '@primeuix/themes/lara';
import router from './router/index.js';
import { Toast, ToastService } from 'primevue';
import Chart from 'primevue/chart';
import 'chart.js/auto'
import { createPinia } from 'pinia';

const app = createApp(App);

// cria a instância do pinia
const pinia = createPinia()

// registra no app
app.use(pinia)

app.use(PrimeVue, {
    theme: {
        preset: Lara,
        darkModeSelector: 'none',
    }
});

app.use(ToastService)

app.component('Button', Button);
app.component('Toast', Toast);
app.component('Chart', Chart)

app.use(router)

app.mount('#app');