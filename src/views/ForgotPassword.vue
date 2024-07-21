<template>
  <form class="mx-auto max-w-md bg-slate-100 p-4 mt-12 rounded-lg" @submit.prevent="auth.forgotPassword(form)">
    <h3 class="font-bold">Forgot password</h3>
    <div class="m-2 p-2 text-green-900 font-semibold bg-green-300 rounded-md" v-if="auth.status">
      {{ auth.status }}
    </div>
    <div class="my-6">
      <label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
      <input type="email" id="email" v-model="form.email" class="
          block
          w-full
          rounded-lg
          border border-gray-300
          bg-gray-50
          p-2.5
          text-sm text-gray-900
          focus:border-blue-500 focus:ring-blue-500
          dark:border-gray-600
          dark:bg-gray-700
          dark:text-white
          dark:placeholder-gray-400
          dark:focus:border-blue-500
          dark:focus:ring-blue-500
        " />
      <div v-if="auth.error">
        <div v-if="auth.error.validation.email" class="label">
          <span class="label-text-alt text-red-400 text-sm">{{ auth.error.validation.email }}</span>
        </div>
      </div>
    </div>
    <button class="
        w-full
        rounded-lg
        bg-blue-700
        px-5
        py-2.5
        text-center text-sm
        font-medium
        text-white
        hover:bg-blue-800
        focus:outline-none focus:ring-4 focus:ring-blue-300
        dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
        sm:w-auto
      ">
      Submit
    </button>
  </form>
</template>
<script setup>
import { ref } from "vue";
import { useAuthStore } from '../stores/authStore';

const auth = useAuthStore();

const form = ref({
  email: ""
});
</script>