import { createRouter, createWebHistory } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import LoginForm from './components/auth/LoginForm.vue';
import AdminDashboard from './components/dashboard/AdminDashboard.vue';
import UserPage from './components/dashboard/UserDashboard.vue';
import RegisterForm from './components/auth/RegisterForm.vue';
import UsersList from './components/admin/users/UsersList.vue';
import SitesList from './components/admin/site/SitesList.vue';
import MaintenancesList from './components/admin/maintenance/MaintenancesList.vue';
import CreateMaintenance from './components/admin/maintenance/CreateMaintenance.vue';
import EditSite from './components/admin/site/EditSite.vue';
import DetailsMaintenance from './components/admin/maintenance/DetailsMaintenance.vue';
import ClientList from './components/admin/client/ClientList.vue'

const routes = [
  { path: '/', component: LoginForm },
  { path: '/user', 
    component: UserPage, 
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAdmin: true },
    children: [
      {
        path: 'users',
        component: UsersList,
      },
      {
        path: 'sites',
        component: SitesList,
      },
      {
        path: 'clients',
        component: ClientList,
      },
      {
        path: 'maintenances',
        component: MaintenancesList,
      },
      {
        path: 'maintenance/details/:id',
        component: DetailsMaintenance,
      },
      {
        path: 'maintenances/create',
        component: CreateMaintenance,
      },
      {
        path: '/admin/site/edit/:id',
        component: EditSite,
      },
    ],
  },
  { path: '/register', component: RegisterForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            return next({ path: '/' });
        }

        try {
            const decodedToken = jwtDecode(token);

            if (!decodedToken) {
            return next({ path: '/' });
            }
        } catch (error) {
            console.error('Invalid token', error);
            return next({ path: '/' });
        }
    }

    if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (!token) {
        return next({ path: '/' });
        }

        try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.role !== 'admin') {
            alert('Accès refusé. Vous devez être administrateur.');
            return next({ path: '/' });
        }
        } catch (error) {
        console.error('Invalid token', error);
        return next({ path: '/' });
        }
    }

  next();
});

export default router;



