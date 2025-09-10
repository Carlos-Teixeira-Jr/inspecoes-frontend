import Dashboard from '../views/Dashboard.vue'
import Clientes from '../views/Customers.vue'
import Reports from '../views/Reports.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/clientes', name: 'Customers', component: Clientes },
  { path: '/reports', name: 'Reports', component: Reports },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
