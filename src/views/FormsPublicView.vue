<template>
  <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div class="py-5 px-8">
        <div v-if="loading" class="flex justify-center">
          <span class="loading loading-dots loading-lg mr-1"></span>
        </div>

        <div v-else-if="!form.accept_response">
          <h1 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{{ form.title }}
          </h1>
          <p class="mt-6 text-base leading-7 text-gray-600">The form {{ form.title }} is no
            longer accepting responses. <br> Try contacting the owner of the form if you think this is a
            mistake.
          </p>
        </div>

        <div v-else-if="formResponseStore.ended" class="text-center">
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Your response has been recorded
          </h1>
          <p class="mt-6 text-base leading-7 text-gray-600">Thank you for participating</p>

          <div v-if="form.show_results" class="mt-10 flex items-center justify-center gap-x-6 rounded-full">
            <div v-if="loadResult" class="flex justify-center">
              <span class="loading loading-dots loading-lg mr-1"></span>
            </div>
            <div v-else>
              <p class="text-base font-bold leading-7 text-gray-600">Your Overall Score</p>
              <div class="mt-3 flex h-40 w-40 items-center justify-center rounded-full bg-gray-900 gap-x-3">
                <span class="text-5xl font-medium text-white">{{ results.overall_results.total_correct_responses }}
                  &#47;</span>
                <span class="text-3xl font-medium text-slate-400">{{ results.overall_results.total_questions }}</span>
              </div>
              <div v-for="section in results.section_results" :key="section.section_id" class="mt-6">
                <p class="text-base font-semibold leading-7 text-gray-600">{{ section.section_title }}</p>
                <div class="mt-2 flex items-center justify-center rounded-full bg-gray-200 p-3">
                  <span class="text-3xl font-medium text-gray-900">{{ section.correct_responses }} &#47;</span>
                  <span class="text-2xl font-medium text-gray-600">{{ section.total_questions }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="form.multiple_attempts" class="mt-10 flex items-center justify-center gap-x-6">
            <button @click="submitAnotherResponse" type="button"
              class="rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
              Submit another response
            </button>
            <router-link :to="{ name: 'Login' }" class="text-sm font-semibold text-gray-900">Cancel</router-link>
          </div>
        </div>

        <form v-else-if="!formResponseStore.ended" @submit.prevent="submitForm" class="container mx-auto">
          <div class="grid items-center mb-5">
            <div class="hero">
              <div class="hero-content flex-col lg:flex-row-reverse">
                <ImageElement v-if="form.image_webp_url || form.image_url" :webp-src="form.image_webp_url"
                  :fallback-src="form.image_url" :alt="form.title" class="max-w-sm rounded-lg" height="280" width="200"
                  v-fullscreen-image="{
                    imageUrl: form.image_webp_url,
                    withDownload: false,
                    animation: 'fade',
                  }" />
                <div>
                  <h1 class="text-5xl font-bold">{{ form.title }}</h1>
                  <p class="py-6" v-html="form.description"></p>
                  <button v-if="!formResponseStore.started" class="btn btn-neutral" @click="start">Start</button>

                  <div v-if="formResponseStore.started" class="flex gap-5">
                    <div>
                      <span class="countdown font-mono text-4xl">
                        {{ timeLeft.hours }}
                      </span>
                      hours
                    </div>
                    <div>
                      <span class="countdown font-mono text-4xl">
                        {{ timeLeft.minutes }}
                      </span>
                      minutes
                    </div>
                    <div>
                      <span class="countdown font-mono text-4xl">
                        {{ timeLeft.seconds }}
                      </span>
                      sec
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div v-if="formResponseStore.started" class="grid items-center">
            <div v-for="(section, sectionIndex) in form.sections" :key="sectionIndex"
              class="mb-5 border-b border-gray-900/10 pb-12">
              <label for="title" class="block text-sm font-medium leading-6 text-gray-900">
                Section {{ sectionIndex + 1 }}
                <span v-if="section.title">: {{ section.title }}</span>
                <span v-if="section.description">{{ section.description }}</span>
              </label>
              <div v-for="(question, ind) of section.questions" :key="question.id" class="mt-3">
                <FormViewer v-model="responses[question.id]" :question="question" :index="ind" />
              </div>
            </div>
          </div>

          <div v-if="formResponseStore.started" class="mt-6 flex items-center justify-start">
            <button type="submit" class="btn btn-neutral">
              Submit
            </button>
          </div>
        </form>
      </div>

      <TimerExpiredDialog :hasExpired="hasExpired" @submit="submitForm" @reset="resetTimer" />
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

import { useFormStore } from "../stores/formStore";
import { useFormResponseStore } from "../stores/formResponseStore";

import FormViewer from "../components/viewer/FormViewer.vue";
import TimerExpiredDialog from "../components/TimerExpiredDialog.vue";
import ImageElement from "../components/ImageElement.vue";

const route = useRoute();
const formStore = useFormStore();
const formResponseStore = useFormResponseStore();

const loading = computed(() => formStore.currentForm.loading);
const form = computed(() => formStore.currentForm.data);

const results = computed(() => formResponseStore.results);
const loadResult = computed(() => formResponseStore.loadResults);

let timerId = null;
const responses = ref({});
const hasExpired = ref(false);

formStore.getFormBySlug(route.params.slug);

const start = () => {
  formResponseStore.started = true;
  const startTimeKey = 'startTime-' + route.params.slug;
  const endTimeKey = 'endTime-' + route.params.slug;

  let startTime = localStorage.getItem(startTimeKey);
  let endTime = localStorage.getItem(endTimeKey);

  if (!startTime) {
    startTime = Date.now();
    localStorage.setItem(startTimeKey, startTime);
  }

  formResponseStore.startTime = Number(startTime);

  if (!endTime && form.value.time_limit) {
    const timeLimit = Number(form.value.time_limit);
    if (!isNaN(timeLimit) && timeLimit > 0) {
      endTime = Number(startTime) + timeLimit * 60 * 1000;
      localStorage.setItem(endTimeKey, endTime);
    }
  }

  formResponseStore.endTime = Number(endTime) || null;
  formResponseStore.now = formResponseStore.startTime;

  if (timerId) {
    clearInterval(timerId);
  }

  timerId = setInterval(() => {
    formResponseStore.now += 1000;
    const timeLeft = Math.floor((formResponseStore.endTime - formResponseStore.now) / 1000);
    if (timeLeft <= 0) {
      clearInterval(timerId);
      hasExpired.value = true;
    }
  }, 1000);
};

const timeLeft = computed(() => {
  if (!formResponseStore.started || formResponseStore.endTime === null) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }

  let timeLeft = Math.floor((formResponseStore.endTime - formResponseStore.now) / 1000);
  if (timeLeft <= 0) {
    hasExpired.value = true;
    return { hours: '00', minutes: '00', seconds: '00' };
  } else {
    let hours = Math.floor(timeLeft / 3600);
    let minutes = Math.floor((timeLeft % 3600) / 60);
    let seconds = timeLeft % 60;

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return { hours, minutes, seconds };
  }
});

function checkExpiration() {
  const endTimeKey = 'endTime-' + route.params.slug;
  const endTime = localStorage.getItem(endTimeKey);
  if (endTime) {
    const currentTime = Date.now();
    hasExpired.value = currentTime >= Number(endTime);
  }
}

const resetTimer = () => {
  hasExpired.value = false;
};

function submitForm() {
  const formattedResponses = form.value.sections.flatMap(section =>
    section.questions.map(question => ({
      sectionId: section.id,
      questionId: question.id,
      response: responses.value[question.id]
    }))
  );

  formResponseStore
    .storeFormResponse({
      formId: form.value.id,
      responses: formattedResponses,
    })
    .then((response) => {
      if (response.status === 201) {
        if (form.value.show_results) {
          formResponseStore.showResults(form.value.id);
        }
        formResponseStore.ended = true;
        formResponseStore.started = false;
        clearStorage();
      }
    })
}

function clearStorage() {
  const startTimeKey = 'startTime-' + route.params.slug;
  const endTimeKey = 'endTime-' + route.params.slug;

  localStorage.removeItem(startTimeKey);
  localStorage.removeItem(endTimeKey);
  localStorage.removeItem('response');
}

function submitAnotherResponse() {
  responses.value = {};
  formResponseStore.ended = false;
  clearStorage();
  start();
}

onMounted(() => {
  checkExpiration();
  if (timerId) {
    clearInterval(timerId);
  }
  timerId = setInterval(() => {
    formResponseStore.now = Date.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timerId);
});
</script>
