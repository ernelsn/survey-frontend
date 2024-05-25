<template>
  <PageComponent>
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ route.params.id ? model.title : "Create a Survey" }}
        </h1>

        <div class="flex gap-2">
          <a :href="`/view/survey/${model.slug}`" target="_blank" v-if="model.slug"
            class="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
              <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
            </svg>
            View
          </a>
          <button v-if="route.params.id" type="button" @click="deleteSurvey()" class="btn btn-error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </template>

    <div v-if="surveyLoading" class="flex justify-center"><span class="loading loading-dots loading-lg"></span></div>

    <form v-else @submit.prevent="saveSurvey" class="animate-fade-in-down">
      <div class="shadow sm:rounded-md sm:overflow-hidden">
        <!-- Survey Fields -->
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Image
            </label>
            <div class="mt-1 flex items-center">
              <img v-if="model.image_url" :src="model.image_url" :alt="model.title" class="w-64 h-48 object-cover" />
              <span v-else class="flex items-center justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-[80%] w-[80%] text-gray-300" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd" />
                </svg>
              </span>
              <button type="button"
                class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <input type="file" @change="onImageChoose"
                  class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer" />
                Change
              </button>
            </div>
          </div>

          <label class="form-control w-full">
            <div class="label">
              <span class="label-text font-medium text-gray-700">Title</span>
            </div>
            <input type="text" name="title" id="title" v-model="model.title" autocomplete="survey_title"
              class="input input-bordered w-full" />
          </label>

          <label class="form-control">
            <div class="label">
              <span class="label-text font-medium text-gray-700">Description</span>
            </div>
            <textarea id="description" name="description" class="textarea textarea-bordered h-32" v-model="model.description" 
              placeholder="The description about the survey"></textarea>
          </label>

          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <label class="form-control">
              <div class="label">
                <span class="label-text font-medium text-gray-700">Expire Date</span>
              </div>
              <input type="date" name="expire_date" id="expire_date" v-model="model.expire_date" class="input input-bordered w-full" />
            </label>

            <label class="form-control">
              <div class="label">
                <span class="label-text font-medium text-gray-700">Time limit</span>
              </div>
              <input type="number" name="time_limit" id="time_limit" v-model="model.time_limit"
                class="input input-bordered w-full" />
            </label>
          </div>

          <div class="form-control flex items-start">
            <label class="label cursor-pointer gap-x-4">
              <input id="status" name="status" type="checkbox" v-model="model.status" class="checkbox" />
              <span class="label-text font-medium text-gray-700">Publish</span> 
            </label>
          </div>
        </div>
        <!-- Survey Fields -->

        <div class="px-4 py-5 bg-white space-y-6 sm:p-6" ref="referenceRef">
          <div class="flex lg:flex lg:items-center lg:justify-between">
            <div class="min-w-0 flex-1">
              <h3 class="text-2xl font-semibold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Questions</h3>
            </div>
          </div>

          <div v-if="!model.questions.length" class="text-center text-gray-600">
            You don't have any questions created
          </div>

          <div v-for="(question, index) in model.questions" :key="question.id">
            <QuestionEditor :question="question" :index="index" @change="questionChange" @addQuestion="addQuestion"
              @deleteQuestion="deleteQuestion" />
          </div>

          <div class="flex flex-col gap-2 px-2" ref="floatingRef" :style="floatingStyles">
            <button type="button" class="btn w-full sm:w-auto" @click="addQuestion(model.questions.length)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path fill-rule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z" clip-rule="evenodd" />
              </svg>
              Question
            </button>

            <button type="submit" class="btn w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path fill-rule="evenodd" d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z" clip-rule="evenodd" />
                <path d="M3.5 6A1.5 1.5 0 0 0 2 7.5v9A1.5 1.5 0 0 0 3.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L8.44 6.439A1.5 1.5 0 0 0 7.378 6H3.5Z" />
              </svg>
              Save
            </button>
          </div>

        </div>

      </div>
    </form>
  </PageComponent>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSurveyStore } from "../stores/surveyStore";
import { useDashboardStore } from '../stores/dashboardStore';
import { flip, useFloating, autoUpdate } from '@floating-ui/vue';

import PageComponent from "../components/PageComponent.vue";
import QuestionEditor from "../components/editor/QuestionEditor.vue";

const referenceRef = ref(null);
const floatingRef = ref(null);

const { floatingStyles } = useFloating(referenceRef, floatingRef, {
  placement: 'right',
  middleware: [ flip({ fallbackPlacements: ['bottom'] }) ],
  whileElementsMounted: autoUpdate,
});

const router = useRouter();
const route = useRoute();
const surveyStore = useSurveyStore();
const dashboardStore = useDashboardStore();

// Get survey loading state, which only changes when we fetch survey from backend
const surveyLoading = computed(() => surveyStore.currentSurvey.loading);

// Create empty survey
let model = ref({
  title: "",
  slug: "",
  status: false,
  description: null,
  image: null,
  image_url: null,
  expire_date: null,
  time_limit: null,
  questions: [],
});

// Watch current survey data change and when this happens we update local model
watch(
  () => surveyStore.currentSurvey.data,
  (newVal, oldVal) => {
    model.value = {
      ...newVal,
      status: !!newVal.status,
    };
  }
);

// If the current component is rendered on survey update route we make a request to fetch survey
if (route.params.id) {
  surveyStore.fetchSurvey(route.params.id);
}

function onImageChoose(ev) {
  const file = ev.target.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    setImage(reader.result);
    ev.target.value = "";
  };
  reader.readAsDataURL(file);
}

function setImage(image) {
  model.value.image = image;
  model.value.image_url = image;
}

function addQuestion(index) {
  const newQuestion = {
    id: uuidv4(),
    type: "text",
    question: "",
    description: null,
    data: {},
  };

  model.value.questions.splice(index, 0, newQuestion);
}

function deleteQuestion(question) {
  model.value.questions = model.value.questions.filter((q) => q !== question);
}

function questionChange(question) {
  // Important to explicitelly assign question.data.options, because otherwise it is a Proxy object
  // and it is lost in JSON.stringify()
  if (question.data.options) {
    question.data.options = [...question.data.options];
  }
  model.value.questions = model.value.questions.map((q) => {
    if (q.id === question.id) {
      return { ...question };
    }
    return q;
  });
}


// Create or update survey
async function saveSurvey() {
  let action = "created";
  if (model.value.id) {
    action = "updated";
  }
  const { data } = await surveyStore.storeSurvey({ ...model.value });
  dashboardStore.notify({
    type: "success",
    message: `The survey was successfully ${action}`,
  });
  router.push({
    name: "SurveyView",
    params: { id: data.data.id },
  });
}

function deleteSurvey() {
  if (
    confirm(
      `Are you sure you want to delete this survey? Operation can't be undone!!`
    )
  ) {
    surveyStore.deleteSurvey(model.value.id).then(() => {
      router.push({
        name: "Surveys",
      });
    });
  }
}
</script>
