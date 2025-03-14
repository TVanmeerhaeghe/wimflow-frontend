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
import ClientList from './components/admin/client/ClientList.vue';
import EditClient from './components/admin/client/EditClient.vue';
import CreateEstimate from './components/admin/estimate/CreateEstimate.vue';
import EstimateList from './components/admin/estimate/EstimateList.vue';
import EditEstimate from './components/admin/estimate/EditEstimate.vue';
import CreateInvoice from './components/admin/invoice/CreateInvoice.vue';
import InvoiceList from './components/admin/invoice/InvoiceList.vue';
import EditInvoice from './components/admin/invoice/EditInvoice.vue';
import Settings from './components/admin/settings/Settings.vue';
import CompanyInfoForm from './components/admin/settings/tabs/CompanyInfoForm.vue';
import CreateProject from './components/admin/project/CreateProject.vue';
import ProjectList from './components/admin/project/ProjectList.vue';
import ProjectDetails from './components/admin/project/ProjectDetails.vue';
import ProjectOverview from './components/admin/project/tabs/ProjectOverview.vue';
import ProjectKanban from './components/admin/project/tabs/ProjectKanban.vue';
import ProjectEdit from './components/admin/project/tabs/ProjectEdit.vue';
import ProjectInvoices from './components/admin/project/tabs/ProjectInvoices.vue';
import ProjectEstimates from './components/admin/project/tabs/ProjectEstimates.vue';
import DateFormat from './components/admin/settings/tabs/DateFormat.vue';
import ProjectFile from './components/admin/project/tabs/ProjectFile.vue';

const routes = [
  { path: '/', component: LoginForm },
  {
    path: '/user',
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
        path: 'site/edit/:id',
        component: EditSite,
      },
      {
        path: 'clients',
        component: ClientList,
      },
      {
        path: 'client/edit/:id',
        component: EditClient,
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
        path: 'estimate',
        component: EstimateList,
      },
      {
        path: 'estimate/create',
        component: CreateEstimate,
      },
      {
        path: 'estimate/edit/:id',
        component: EditEstimate,
      },
      {
        path: 'invoice',
        component: InvoiceList,
      },
      {
        path: 'invoice/create',
        component: CreateInvoice,
      },
      {
        path: 'invoice/edit/:id',
        component: EditInvoice,
      },
      {
        path: "project",
        component: ProjectList,
      },
      {
        path: "project/create",
        component: CreateProject,
      },
      {
        path: '/admin/project/details/:id',
        component: ProjectDetails,
        children: [
          {
            path: 'overview',
            component: ProjectOverview,
          },
          {
            path: 'kanban',
            component: ProjectKanban,
          },
          {
            path: 'estimates',
            component: ProjectEstimates,
          },
          {
            path: 'invoices',
            component: ProjectInvoices,
          },
          {
            path: 'file',
            component: ProjectFile,
          },
          {
            path: 'edit',
            component: ProjectEdit,
          },
        ],
      },
      {
        path: 'settings',
        component: Settings,
        children: [
          {
            path: 'company-info',
            component: CompanyInfoForm
          },
          {
            path: 'date-format',
            component: DateFormat,
          }
        ],
      },
    ],
  },
  { path: '/register', component: RegisterForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
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
