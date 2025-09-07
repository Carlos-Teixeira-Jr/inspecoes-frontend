import Dashboard from '../views/Dashboard.vue'
import Clientes from '../views/Customers.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/clientes', name: 'Customers', component: Clientes },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
