import { createRouter, createWebHistory } from "vue-router";

const DefaultLayout = () => import("../components/DefaultLayout.vue");

const Login = () => import("../views/Login.vue");
const Register = () => import("../views/Register.vue");
const ForgotPassword = () => import("../views/ForgotPassword.vue");
const PasswordReset = () => import("../views/PasswordReset.vue");

const Dashboard = () => import("../views/Dashboard.vue");
const Forms = () => import("../views/Forms.vue");
const FormsModule = () => import("../views/FormsModule.vue");
const FormResponses = () => import("../views/FormResponses.vue");
const FormsPublicView = () => import("../views/FormsPublicView.vue");

const Learnings = () => import("../views/Learnings.vue");

const NotFound = () => import("../components/errors/NotFound.vue");

import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "/dashboard", name: "Dashboard", component: Dashboard },
      { path: "/forms", name: "Forms", component: Forms },
      { path: "/forms/create", name: "FormCreate", component: FormsModule },
      { path: '/forms/edit/:id?', name: 'FormEdit', component: FormsModule, 
        props: route => ({ 
          id: route.params.id, 
          draftId: route.query.draft || route.query.draftId 
        }) 
      },
      { path: "/forms/:id/responses", name: "FormResponses", component: FormResponses },
      { path: "/learnings", name: "Learnings", component: Learnings },
    ],
  },
  {
    path: "/view/forms/:slug/public",
    name: 'FormsPublicView',
    component: FormsPublicView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {isGuest: true},
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {isGuest: true},
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword
  },
  {
    path: "/password-reset/:token",
    name: "PasswordReset",
    component: PasswordReset,
  },
  { 
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the route requires authentication
    authStore.fetchUser().then(() => {
      if (authStore.user) {
        // User is authenticated, proceed to the route or dashboard
        next();
      } else {
        // Not authenticated, redirect to login
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
      }
    }).catch(() => {
      // Error fetching user, redirect to login
      next('/login');
    });
  } else if (to.name === 'Login' || to.name === 'Register') {
    // If trying to access login/register
    authStore.fetchUser().then(() => {
      if (authStore.user) {
        // Already authenticated, redirect to dashboard
        next('/dashboard');
      } else {
        // Not authenticated, proceed to login/register
        next();
      }
    }).catch(() => {
      // Error fetching user, proceed to login/register
      next();
    });
  } else {
    // For non-authenticated routes
    next();
  }
 });


export default router;
