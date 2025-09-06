import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';

import './style.css'; // Tailwind
import 'primeicons/primeicons.css'; // Ícones PrimeVue

import Lara from '@primeuix/themes/lara';

const app = createApp(App);
app.component('Button', Button);

app.use(PrimeVue, {
    theme: {
        preset: Lara
    }
});


app.mount('#app');