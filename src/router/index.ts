import Dashboard from '../views/Dashboard.vue'
import Clientes from '../views/Customers.vue'
import Reports from '../views/Reports.vue'
import { createRouter, createWebHistory } from 'vue-router'
import NewPage from '../views/NewPage.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/clientes', name: 'Customers', component: Clientes },
  { path: '/reports', name: 'Reports', component: Reports },
  { path: '/new-page', name: 'NewPage', component: NewPage},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
