<template>
  <PageComponent title="Dashboard">
    <div v-if="loading" class="flex justify-center">
      <span class="loading loading-dots loading-lg"></span>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
      <div class="bg-white shadow-md p-3 text-center flex flex-col animate-fade-in-down order-1 lg:order-2"
        style="animation-delay: 0.1s">
        <h3 class="text-2xl font-semibold">Total Surveys</h3>
        <div class="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
          {{ data.totalSurveys }}
        </div>
      </div>
      <div class="bg-white shadow-md p-3 text-center flex flex-col order-2 lg:order-4 animate-fade-in-down"
        style="animation-delay: 0.2s">
        <h3 class="text-2xl font-semibold">Total Answers</h3>
        <div class="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
          {{ data.totalAnswers }}
        </div>
      </div>
      <div class="row-span-2 animate-fade-in-down order-3 lg:order-1 bg-white shadow-md p-4">
        <h3 class="text-2xl font-semibold">Latest Survey</h3>
        <div v-if="data.latestSurvey">
          <img :src="data.latestSurvey.image_url" class="w-[240px] mx-auto" alt="" />
          <h3 class="font-bold text-xl mb-3">{{ data.latestSurvey.title }}</h3>
          <div class="flex justify-between text-sm mb-1">
            <div>Create Date:</div>
            <div>{{ data.latestSurvey.created_at }}</div>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <div>Expire Date:</div>
            <div>{{ data.latestSurvey.expire_date }}</div>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <div>Status:</div>
            <div>{{ data.latestSurvey.status ? "Active" : "Draft" }}</div>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <div>Questions:</div>
            <div>{{ data.latestSurvey.questions }}</div>
          </div>
          <div class="flex justify-between text-sm mb-3">
            <div>Answers:</div>
            <div>{{ data.latestSurvey.answers }}</div>
          </div>
          <div class="flex justify-between">
            <router-link :to="{ name: 'SurveyView', params: { id: data.latestSurvey.id } }" class="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
              </svg>
              Edit
            </router-link>

            <router-link :to="{ name: 'SurveyResponse', params: { id: data.latestSurvey.id } }" class="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" />
              </svg>
              View responses
            </router-link>
          </div>
        </div>
        <div v-else class="text-gray-600 text-center py-16">
          You don't have surveys yet
        </div>
      </div>
      <div class="bg-white shadow-md p-3 row-span-2 order-4 lg:order-3 animate-fade-in-down"
        style="animation-delay: 0.3s">
        <div class="flex justify-between items-center mb-3 px-2">
          <h3 class="text-2xl font-semibold">Latest Answers</h3>

          <a href="javascript:void(0)" class="text-sm text-blue-500 hover:decoration-blue-500">
            View all
          </a>
        </div>

        <div v-if="data.latestAnswers.length">
          <a href="#" v-for="answer of data.latestAnswers" :key="answer.id" class="block p-2 hover:bg-gray-100/90">
            <div class="font-semibold">{{ answer.survey.title }}</div>
            <small>
              Answer Made at:
              <i class="font-semibold">{{ answer.end_date }}</i>
            </small>
          </a>
        </div>
        <div v-else class="text-gray-600 text-center py-16">
          You don't have answers yet
        </div>
      </div>
    </div>
  </PageComponent>
</template>

<script setup>
import PageComponent from "../components/PageComponent.vue";
import { computed } from "vue";
import { useDashboardStore } from '../stores/dashboardStore';

const dashboardStore = useDashboardStore();

const loading = computed(() => dashboardStore.loading);
const data = computed(() => dashboardStore.data);

dashboardStore.getDashboardData();
</script>
