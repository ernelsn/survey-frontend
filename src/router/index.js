import { createRouter, createWebHistory } from "vue-router";

const DefaultLayout = () => import("../components/DefaultLayout.vue");

const Login = () => import("../views/Login.vue");
const Register = () => import("../views/Register.vue");
const ForgotPassword = () => import("../views/ForgotPassword.vue");
const PasswordReset = () => import("../views/PasswordReset.vue");

const Dashboard = () => import("../views/Dashboard.vue");
const Surveys = () => import("../views/Surveys.vue");
const SurveyView = () => import("../views/SurveyView.vue");
const SurveyPublicView = () => import("../views/SurveyPublicView.vue");

const Learnings = () => import("../views/Learnings.vue");

const NotFound = () => import("../views/NotFound.vue");

import { useAuthStore } from '../stores/authStore';
import { useSurveyStore } from '../stores/surveyStore';

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "/dashboard", name: "Dashboard", component: Dashboard },
      { path: "/surveys", name: "Surveys", component: Surveys },
      { path: "/surveys/create", name: "SurveyCreate", component: SurveyView },
      { path: "/surveys/:id", name: "SurveyView", component: SurveyView },
      { path: "/learnings", name: "Learnings", component: Learnings },
    ],
  },
  {
    path: "/view/survey/:slug",
    name: 'SurveyPublicView',
    component: SurveyPublicView,
    beforeEnter: async (to, from, next) => {
      const surveyStore = useSurveyStore();
      try {
        const response = await surveyStore.getSurveyBySlug(to.params.slug);
        if (response.data.status === 0) {
          to.matched[0].components.default = NotFound;
          next();
        } else {
          next();
        }
      } catch (error) {
        to.matched[0].components.default = NotFound;
        next();
      }
    }
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
