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

const NotFound = () => import("../views/NotFound.vue");

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
    authStore.fetchUser().then(() => {
      if (authStore.user) {
        next();
      } else {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
      }
    }).catch(error => {
      next({
        path: '/login',
        // query: { redirect: to.fullPath }
      });
    });
  } else {
    next();
  }
});


export default router;
