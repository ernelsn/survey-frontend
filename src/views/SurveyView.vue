<template>
  <PageComponent>
    <template v-slot:header>
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{{
            route.params.id ? model.title : "Create survey" }}</h2>
        </div>
        <div class="mt-5 flex lg:ml-4 lg:mt-0">
          <span class="sm:ml-3">
            <a :href="`/view/survey/${model.slug}`" target="_blank" v-if="model.slug" class="btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path
                  d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
                <path
                  d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
              </svg>
              View
            </a>
          </span>

          <span class="ml-3 sm:ml-3">
            <button v-if="route.params.id" type="button" @click="isOpened = true" class="btn btn-error">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path fill-rule="evenodd"
                  d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                  clip-rule="evenodd" />
              </svg>
              Delete
            </button>
          </span>

          <DeleteSurveyDialog :is-opened="isOpened" @toggle="(value) => isOpened = value" :on-delete="performDelete" />
        </div>
      </div>
    </template>

    <div v-if="surveyLoading" class="flex justify-center"><span class="loading loading-dots loading-lg"></span></div>

    <div v-else class="mx-auto px-4 lg:px-8">
      <form @submit.prevent="saveSurvey" class="animate-fade-in-down">
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="col-span-full">
                <label for="cover-photo" class="block text-sm font-medium leading-6 text-gray-900">Photo</label>
                <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div class="text-center">
                    <img v-if="model.image_url" :src="model.image_url" :alt="model.title"
                      class="w-64 h-48 object-cover" />
                    <PhotoIcon v-else class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div class="mt-4 flex text-sm leading-6 text-gray-600">
                      <label for="file-upload"
                        class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>Upload an image</span>
                        <input id="file-upload" name="file-upload" type="file" class="sr-only"
                          @change="onImageChoose" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-span-full">
                <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
                <div class="mt-2">
                  <input type="text" name="title" id="title" v-model="model.title"
                    class="input input-bordered w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div class="col-span-full">
                <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                <div class="mt-2">
                  <textarea id="description" name="description" v-model="model.description"
                    placeholder="The description about the survey"
                    class="textarea textarea-bordered h-24 w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="expire_date" class="block text-sm font-medium leading-6 text-gray-900">Expire Date</label>
                <div class="mt-2">
                  <input type="date" name="expire_date" id="expire_date" v-model="model.expire_date" :min="minDate"
                    class="input input-bordered w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="last-name" class="block text-sm font-medium leading-6 text-gray-900">Time limit (time in
                  minutes)</label>
                <div class="mt-2">
                  <input type="number" name="time_limit" id="time_limit" v-model="model.time_limit"
                    class="input input-bordered w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Please input time in minutes" min="0"
                    @input="model.time_limit = Math.max(0, model.time_limit)" />
                </div>
              </div>
            </div>
          </div>

          <div class="border-b border-gray-900/10 pb-12">
            <h1 class="text-base font-semibold leading-7 text-gray-900">Settings</h1>
            <div class="mt-10 space-y-10">
              <fieldset>
                <legend class="text-sm font-semibold leading-6 text-gray-900">Display</legend>
                <div class="mt-6 space-y-6">
                  <div class="relative flex gap-x-3">
                    <div class="flex h-6 items-center">
                      <input id="status" name="status" type="checkbox" v-model="model.status" class="checkbox" />
                    </div>
                    <div class="text-sm leading-6">
                      <label for="comments" class="font-medium text-gray-900">Publish</label>
                      <p class="text-gray-500">This configuration determines the publication status of the survey
                        whether the survey should be made accessible to the intended audience or kept private.
                      </p>
                    </div>
                  </div>

                  <div class="relative flex gap-x-3">
                    <div class="flex h-6 items-center">
                      <input id="result" name="result" type="checkbox" v-model="model.result" class="checkbox" />
                    </div>
                    <div class="text-sm leading-6">
                      <label for="comments" class="font-medium text-gray-900">Show result</label>
                      <p class="text-gray-500">This configuration determines whether the score will be shown after the
                        survey.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="border-b border-gray-900/10 pb-12">
            <h1 class="text-base font-semibold leading-7 text-gray-900">Questionnaire Part</h1>

            <div v-for="(question, index) in model.questions" :key="question.id">
              <QuestionEditor :question="question" :index="index" @change="questionChange" @addQuestion="addQuestion"
                @deleteQuestion="deleteQuestion" @scrollToReference="scrollToReference" />
            </div>

            <div v-if="!model.questions.length" class="mt-1 text-sm leading-6 text-gray-600 text-center">
              No questions have been created yet. Please proceed with your first creation.
            </div>
          </div>

          <div class="mt-6 flex flex-col items-stretch gap-y-3">
            <button type="button" class="btn w-full" @click="addQuestion(model.questions.length)" ref="reference">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path fill-rule="evenodd"
                  d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z"
                  clip-rule="evenodd" />
              </svg>
              Add question
            </button>
            <button type="submit" class="btn btn-neutral w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path fill-rule="evenodd"
                  d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z"
                  clip-rule="evenodd" />
                <path
                  d="M3.5 6A1.5 1.5 0 0 0 2 7.5v9A1.5 1.5 0 0 0 3.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L8.44 6.439A1.5 1.5 0 0 0 7.378 6H3.5Z" />
              </svg>
              Save
            </button>
          </div>

        </div>
      </form>
    </div>
  </PageComponent>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { computed, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSurveyStore } from "../stores/surveyStore";
import { useDashboardStore } from '../stores/dashboardStore';

import PageComponent from "../components/PageComponent.vue";
import QuestionEditor from "../components/editor/QuestionEditor.vue";
import DeleteSurveyDialog from "../components/DeleteSurveyDialog.vue";

import { PhotoIcon } from '@heroicons/vue/24/solid';

const reference = ref(null);

const isOpened = ref(false);

const router = useRouter();
const route = useRoute();
const surveyStore = useSurveyStore();
const dashboardStore = useDashboardStore();

const minDate = computed(() => {
  return new Date().toISOString().slice(0, 10);
});

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

  scrollToReference();
}

function scrollToReference() {
  nextTick(() => {
    if (reference.value) {
      reference.value.scrollIntoView({ behavior: 'smooth' });
    }
  });
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

function performDelete() {
  surveyStore.deleteSurvey(model.value.id).then(() => {
    router.push({
      name: "Surveys",
    });
  });
}
</script>
