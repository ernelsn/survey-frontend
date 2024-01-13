import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "../components/DefaultLayout.vue";
import AuthLayout from "../components/AuthLayout.vue";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import PasswordReset from "../views/PasswordReset.vue";

import Dashboard from "../views/Dashboard.vue";
import Surveys from "../views/Surveys.vue";
import SurveyView from "../views/SurveyView.vue";
import SurveyPublicView from "../views/SurveyPublicView.vue";

import NotFound from "../views/NotFound.vue";

import { useAuthStore } from '../stores/authStore';

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
    ],
  },
  {
    path: "/view/survey/:slug",
    name: 'SurveyPublicView',
    component: SurveyPublicView
  },
  {
    path: "/auth",
    redirect: "/login",
    name: "Auth",
    component: AuthLayout,
    meta: {isGuest: true},
    children: [
      {
        path: "/login",
        name: "Login",
        component: Login,
      },
      {
        path: "/register",
        name: "Register",
        component: Register,
      },
    ],
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
