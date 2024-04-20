<template>
  <div>
    <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
      alt="Workflow" />
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Register for free
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Or
      {{ " " }}
      <router-link :to="{ name: 'Login' }" class="font-medium text-indigo-600 hover:text-indigo-500">
        login to your account
      </router-link>
    </p>
  </div>
  <form class="mt-8 space-y-6" @submit.prevent="authenticate.register(form)">
    <input type="hidden" name="remember" value="true" />
    <div class="rounded-md shadow-sm -space-y-px">
      <div>
        <label for="fullname" class="sr-only">Email address</label>
        <input id="fullname" name="name" type="text" autocomplete="name" v-model="form.name"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Full name" />
      </div>
      <div v-if="authenticate.errors.name && authenticate.errors.name.length > 0" class="flex">
        <span class="text-red-400 text-sm m-2 p-2">
          {{ authenticate.errors.name[0] }}</span>
      </div>
      <div>
        <label for="email-address" class="sr-only">Email address</label>
        <input id="email-address" name="email" type="email" autocomplete="email" v-model="form.email"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Email address" />
      </div>
      <div v-if="authenticate.errors.email && authenticate.errors.email.length > 0" class="flex">
        <span class="text-red-400 text-sm m-2 p-2">
          {{ authenticate.errors.email[0] }}</span>
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" v-model="form.password"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Password" />
      </div>
      <div v-if="authenticate.errors.password && authenticate.errors.password.length > 0" class="flex">
        <span class="text-red-400 text-sm m-2 p-2">
          {{ authenticate.errors.password[0] }}</span>
      </div>
      <div>
        <label for="password_confirmation" class="sr-only">Password</label>
        <input id="password_confirmation" name="password_confirmation" type="password" autocomplete="current-password"
          v-model="form.password_confirmation"
          class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="Confirm Password" />
      </div>
    </div>

    <div>
      <button type="submit" :disabled="authenticate.loading"
        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :class="{
        'cursor-not-allowed': authenticate.loading,
        'hover:bg-indigo-500': authenticate.loading,
      }">
        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
          <LockClosedIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
        </span>
        <svg v-if="authenticate.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        Sign up
      </button>
    </div>
  </form>
</template>

<script setup>
import { LockClosedIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";
import { useAuthStore } from '../stores/authStore';

const authenticate = useAuthStore();

const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: ""
});
</script>
