<template>
  <PageComponent>
    <template v-slot:header>
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Surveys</h2>
        </div>
        <div class="mt-5 flex lg:ml-4 lg:mt-0">
          <span class="sm:ml-3">
            <router-link :to="{ name: 'SurveyCreate' }" class="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Survey
            </router-link>
          </span>
        </div>
      </div>
    </template>
    
    <div v-if="surveys.loading" class="flex justify-center">
      <span class="loading loading-dots loading-lg"></span>
    </div>

    <div v-else-if="surveys.data.length">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        <SurveyListItem v-for="(survey, ind) in surveys.data" :key="survey.id" :survey="survey" class="opacity-0 animate-fade-in-down" 
          :style="{ animationDelay: `${ind * 0.1}s` }" @delete="showDeleteDialog" />

        <DeleteSurveyDialog :isOpened="showDelete" @toggle="(value) => showDelete = value" :on-delete="performDelete" />
      </div>
      <div class="flex justify-center mt-5 border-t border-gray-200 ">
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm mt-5" aria-label="Pagination">
          <a v-for="(link, i) of surveys.links" :key="i" :disabled="!link.url" href="#"
            @click="getForPage($event, link)" aria-current="page"
            class="relative inline-flex items-center px-4 py-2 border text-sm font-medium whitespace-nowrap" :class="[
              link.active
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              i === 0 ? 'rounded-l-md bg-gray-100 text-gray-700' : '',
              i === surveys.links.length - 1 ? 'rounded-r-md' : '',
            ]" v-html="link.label">
          </a>
        </nav>
      </div>
    </div>
    <div v-else class="text-gray-600 text-center py-16">
      You don't have surveys yet
    </div>
  </PageComponent>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSurveyStore } from "../stores/surveyStore";

import DeleteSurveyDialog from "../components/DeleteSurveyDialog.vue";
import PageComponent from "../components/PageComponent.vue";
import SurveyListItem from "../components/SurveyListItem.vue";

const showDelete = ref(false);
const selectedSurvey = ref(null);

const surveyStore = useSurveyStore();

const surveys = computed(() => surveyStore.surveys);

surveyStore.getSurveys();

function showDeleteDialog(id) {
  showDelete.value = true;
  selectedSurvey.value = id;
}

async function performDelete() {
  await surveyStore.deleteSurvey(selectedSurvey.value);
  await surveyStore.getSurveys();
  showDelete.value = false;
}

function getForPage(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }

  surveyStore.getSurveys({ url: link.url });
}
</script>
