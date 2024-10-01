import { createRouter, createWebHistory } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import LoginForm from './components/auth/LoginForm.vue';
import AdminDashboard from './components/dashboard/AdminDashboard.vue';
import UserPage from './components/dashboard/UserDashboard.vue';
import RegisterForm from './components/auth/RegisterForm.vue';

const routes = [
  { path: '/', component: LoginForm },
  { path: '/user', component: UserPage },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAdmin: true },
  },
  { path: '/register', component: RegisterForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

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



