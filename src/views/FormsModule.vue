<template>
  <PageComponent>
    <template v-slot:header>
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{{
            route.params.id ? model.title : "Create form" }}</h2>
        </div>
        <div class="mt-5 flex lg:ml-4 lg:mt-0" v-if="route.params.id">
          <span class="sm:ml-3" v-if="model.slug">
            <router-link :to="{ name: 'FormsPublicView', params: { slug: model.slug } }" target="_blank"
              class="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path
                  d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
                <path
                  d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
              </svg>
              Preview
            </router-link>
          </span>

          <span class="ml-3 sm:ml-3">
            <router-link :to="{ name: 'FormResponses', params: { id: route.params.id } }" class="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path fill-rule="evenodd"
                  d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                  clip-rule="evenodd" />
              </svg>
              View responses
            </router-link>
          </span>

          <span class="ml-3 sm:ml-3">
            <button type="button" @click="openDeleteFormDialog" class="btn btn-error">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path fill-rule="evenodd"
                  d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                  clip-rule="evenodd" />
              </svg>
              Delete
            </button>
          </span>
        </div>
      </div>
    </template>

    <div v-if="formLoading" class="mt-10 flex justify-center content-center"><span
        class="loading loading-dots loading-lg"></span></div>
    <div v-else class="mx-auto px-4 lg:px-8">
      <form @submit.prevent="storeForm" class="animate-fade-in-down" @input="fieldUpdate">
        <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="col-span-full group relative">
                <label for="image" class="block text-sm font-medium leading-6 text-gray-900">Image</label>
                <div v-if="model.image_webp_url || model.image_url"
                  class="mt-2 relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <ImageElement :webp-src="model.image_webp_url" :fallback-src="model.image_url" :alt="model.title"
                    class="h-full w-full object-cover object-center" v-fullscreen-image="{
                      imageUrl: model.image_webp_url,
                      withDownload: false,
                      animation: 'fade',
                    }" />
                </div>
                <div class="mt-2">
                  <module-file-pond name="image" id="image" ref="form-module-pond" class-name="form-module-pond"
                    label-idle="Drop files here..." credits="false" accepted-file-types="image/jpeg, image/png" :server="{
                      url: '',
                      process: handleFilePondProcess,
                      revert: handleFilePondRevert,
                    }" />
                </div>
              </div>

              <div class="col-span-full">
                <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
                <div class="mt-2">
                  <input type="text" name="title" id="title" v-model="model.title"
                    @input="updateFormTitle($event.target.value)"
                    class="input input-bordered w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                </div>
                <div v-if="formStore.error">
                  <div v-if="formStore.error.validation.title" class="label">
                    <span class="label-text-alt text-red-400 text-sm">{{ formStore.error.validation.title }}</span>
                  </div>
                </div>
              </div>

              <div class="col-span-full">
                <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                <div class="mt-2">
                  <textarea id="description" name="description" v-model="model.description"
                    placeholder="The description about the forms"
                    class="textarea textarea-bordered h-24 w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                </div>
              </div>
            </div>
          </div>

          <div class="border-b border-gray-900/10 pb-12">
            <h1 class="text-base font-semibold leading-7 text-gray-900">Settings</h1>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <fieldset class="sm:col-span-3">
                <legend class="text-sm font-semibold leading-6 text-gray-900">Presentation</legend>
                <div class="mt-6 space-y-6">
                  <div class="relative flex gap-x-3">
                    <span class="sm:block">
                      <input type="checkbox" class="peer sr-only opacity-0" id="is_published" name="is_published"
                        v-model="model.is_published" @change="toggleIsPublish" />
                      <label for="is_published"
                        class="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-slate-900 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-slate-700">
                        <span class="sr-only">Enable</span>
                      </label>
                    </span>
                    <div class="text-sm leading-6">
                      <label for="comments" class="font-medium text-gray-900">Publish</label>
                      <p class="text-gray-500">This configuration determines the publication status of the forms
                        whether the forms should be made accessible to the intended audience or kept private.
                      </p>
                    </div>
                  </div>

                  <div v-if="model.is_published" class="relative grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    <div class="text-sm leading-6 sm:col-span-4 sm:col-start-1">
                      <label for="expire_date" class="font-medium text-gray-900">Expiration date (Optional)</label>
                      <p class="text-gray-500">Set expiration date for the current form</p>
                    </div>
                    <div class="flex h-6 items-center sm:col-span-2">
                      <input type="date" name="expire_date" id="expire_date" v-model="model.expire_date" :min="minDate"
                        class="input input-bordered input-sm w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                  </div>

                  <div class="relative flex gap-x-3">
                    <div class="flex h-6 items-center">
                      <input id="multiple_attempts" name="multiple_attempts" type="checkbox"
                        v-model="model.multiple_attempts" class="checkbox" />
                    </div>
                    <div class="text-sm leading-6">
                      <label for="comments" class="font-medium text-gray-900">Multiple attempts</label>
                      <p class="text-gray-500">This configuration determines whether to allow multiple attempts or
                        retakes.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset class="sm:col-span-3">
                <legend class="text-sm font-semibold leading-6 text-gray-900">Quiz</legend>
                <div class="mt-6 space-y-6">
                  <div class="relative flex gap-x-3">
                    <span class="sm:block">
                      <input type="checkbox" class="peer sr-only opacity-0" id="is_quiz" name="is_quiz"
                        v-model="model.is_quiz" @change="toggleIsQuiz" />
                      <label for="is_quiz"
                        class="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-slate-900 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-slate-700">
                        <span class="sr-only">Enable</span>
                      </label>
                    </span>
                    <div class="text-sm leading-6">
                      <span class="ml-3 font-medium text-gray-900 text-sm leading-6">Make this as a quiz</span>
                      <p class="text-gray-500 ml-3">Assign point values, set time limit, and automatically provide
                        feedback
                      </p>
                    </div>
                  </div>

                  <div v-if="model.is_quiz" class="mt-6 space-y-6">
                    <div class="relative flex gap-x-3">
                      <div class="flex h-6 items-center">
                        <input id="show_results" name="show_results" type="checkbox" v-model="model.show_results"
                          class="checkbox" />
                      </div>
                      <div class="text-sm leading-6">
                        <label for="comments" class="font-medium text-gray-900">Show results</label>
                        <p class="text-gray-500">This configuration determines whether the score will be shown
                          immediately after the forms has been submitted.
                        </p>
                      </div>
                    </div>

                    <div class="relative grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                      <div class="text-sm leading-6 sm:col-span-4 sm:col-start-1">
                        <label for="comments" class="font-medium text-gray-900">Default question point value</label>
                        <p class="text-gray-500">Point values for every new question</p>
                      </div>
                      <div class="flex h-6 items-center sm:col-span-2">
                        <div class="flex h-6 items-center sm:col-span-2">
                          <input id="default_points" name="default_points" type="number" v-model="model.default_points"
                            class="input input-bordered input-sm w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            min="0" placeholder="0" @input="handleDefaultPointsInput" />
                        </div>
                      </div>

                      <div class="text-sm leading-6 sm:col-span-4 sm:col-start-1">
                        <label for="comments" class="font-medium text-gray-900">Time limit</label>
                        <p class="text-gray-500">Set time limit in minutes</p>
                      </div>
                      <div class="flex h-6 items-center sm:col-span-2">
                        <input type="number" name="time_limit" id="time_limit" v-model="model.time_limit"
                          class="input input-bordered input-sm w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="0" min="0" @input="model.time_limit = Math.max(0, model.time_limit)" />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="border-b border-gray-900/10 pb-12">
            <h1 class="text-base font-semibold leading-7 text-gray-900">Questionnaire Part</h1>

            <div v-for="(section, sectionIndex) in model.sections" :key="sectionIndex" class="mt-2">
              <div class="relative card bg-base-100 shadow-xl">
                <div
                  class="absolute top-0 left-0 bg-slate-800 text-white text-sm py-1 px-3 rounded-tl-lg rounded-br-lg">
                  Section {{ sectionIndex + 1 }}
                </div>
                <div class="card-body">
                  <div class="card-actions justify-end">
                    <button @click="removeSection(sectionIndex)" type="button"
                      class="btn btn-circle btn-outline btn-error btn-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="mt-2">
                    <input type="text" name="title" id="title" v-model="section.title"
                      class="input input-bordered w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="Title (optional)" />
                  </div>
                  <div class="col-span-full">
                    <textarea v-model="section.description"
                      class="textarea textarea-bordered textarea-xs w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="Description (optional)"></textarea>
                  </div>
                </div>
              </div>
              <div class="mt-3 card bg-base-100 shadow-xl">
                <div class="card-body">
                  <div v-if="formSectionLoading" class="mt-10 flex justify-center content-center">
                    <span class="loading loading-dots loading-lg"></span>
                  </div>
                  <div v-else>
                    <div v-for="(question, questionIndex) in section.questions" :key="question.id">
                      <FormEditor :question="question" :questionIndex="questionIndex" :sectionIndex="sectionIndex"
                        :errors="getQuestionErrors(sectionIndex, questionIndex)"
                        @change="(q) => questionChange(q, sectionIndex, questionIndex)"
                        @addQuestion="(i) => addQuestion(i, sectionIndex)"
                        @deleteQuestion="() => deleteQuestion(sectionIndex, questionIndex)"
                        @scrollToReference="(sectionIndex, questionIndex) => scrollToReference(sectionIndex, questionIndex)"
                        @questionDescriptionAsImage="(sIndex, qIndex, desc) => questionDescriptionAsImage(sIndex, qIndex, desc)" />
                    </div>
                  </div>

                  <div v-if="!section.questions.length" class="mt-1 text-sm leading-6 text-gray-600 text-center">
                    No questions have been created yet. Please proceed with your first creation.
                  </div>
                </div>
                <div class="card-body">
                  <button type="button" class="btn w-full" @click="addQuestion(section.questions.length, sectionIndex)"
                    :ref="el => { if (el) referenceBtn[sectionIndex] = el }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                      <path fill-rule="evenodd"
                        d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z"
                        clip-rule="evenodd" />
                    </svg>
                    Add question
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col items-stretch gap-y-3">
            <button type="button" class="btn w-full" @click="addSection">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path fill-rule="evenodd"
                  d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z"
                  clip-rule="evenodd" />
              </svg>
              Add section
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
    <DeleteFormDialog :is-opened="deleteDialogState.isOpen" @toggle="(value) => deleteDialogState.isOpen = value"
      :on-delete="performDelete" :title="dialogTitle" :message="dialogMessage" />
  </PageComponent>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { computed, ref, watch, nextTick, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { push } from 'notivue';

import { useFormStore } from "../stores/formStore";
import { useDraftStore } from "../stores/draftStore";
import { useUploadStore } from "../stores/uploadStore";

import PageComponent from "../components/PageComponent.vue";
import FormEditor from "../components/editor/FormEditor.vue";
import DeleteFormDialog from "../components/DeleteFormDialog.vue";
import ImageElement from "../components/ImageElement.vue";

import vueFilePond from 'vue-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

const ModuleFilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);

defineProps(['id', 'draftId']);

const router = useRouter();
const route = useRoute();
const formStore = useFormStore();
const draftStore = useDraftStore();
const uploadStore = useUploadStore();

const isQuiz = ref(false);
const isPublish = ref(false);
const referenceBtn = ref({});
const deleteDialogState = ref({
  isOpen: false,
  type: null,
  sectionIndex: null
});

const dialogTitle = computed(() => deleteDialogState.value.type === 'form' ? 'Delete Form' : 'Delete questions and sections?');
const dialogMessage = computed(() => {
  return deleteDialogState.value.type === 'form'
    ? 'Are you sure you want to delete this form? All of the data pertaining to this form will be permanently removed. This action cannot be undone.'
    : 'Deleting a section also deletes the question and responses it contains. This action cannot be undone.';
});

const formLoading = computed(() => formStore.currentForm.loading);
const formSectionLoading = computed(() => formStore.currentForm.sectionLoading);
const minDate = computed(() => new Date().toISOString().slice(0, 10));

const handleDefaultPointsInput = (event) => {
  const newDefaultPoints = parseInt(event.target.value, 10);
  if (isNaN(newDefaultPoints)) {
    model.value.default_points = null;
  } else {
    model.value.default_points = Math.max(0, newDefaultPoints);
  }
  updateQuestionsWithDefaultPoints();
};

const model = ref({
  title: "",
  slug: "",
  description: null,
  image: [],
  is_published: false,
  expire_date: null,
  multiple_attempts: false,
  is_quiz: false,
  show_results: false,
  time_limit: null,
  default_points: null,
  sections: [{
    title: "",
    description: "",
    questions: [],
  }],
});

const isSubmitting = ref(false);
const initialModelState = JSON.stringify(model.value);
let saveTimeout;

onMounted(async () => {
  if (route.query.draft || route.query.draftId) {
    draftStore.draftId = route.query.draft || route.query.draftId;
    await draftStore.loadSpecificDraft();
    Object.assign(model.value, draftStore.data);
    draftStore.setSubmitted(false);
  } else if (route.params.id) {
    const formData = await formStore.getForm(route.params.id);
    Object.assign(model.value, formData);
    draftStore.setSubmitted(true);
    draftStore.setFormTitle(model.value.title);
  } else {
    draftStore.setSubmitted(false);
  }
});

watch(() => formStore.currentForm.data, (newVal) => {
  if (newVal) {
    model.value = {
      ...newVal,
      is_published: !!newVal.is_published,
      is_quiz: !!newVal.is_quiz,
      show_results: !!newVal.show_results,
      multiple_attempts: !!newVal.multiple_attempts,
      sections: newVal.sections?.map(section => ({
        id: section.id,
        title: section.title,
        description: section.description,
        questions: section.questions || [],
      })) || [],
    };
  }
}, { deep: true });

const addSection = () => {
  model.value.sections.push({
    title: "",
    description: "",
    questions: [],
  });
};

const removeSection = (sectionIndex) => {
  deleteDialogState.value = {
    isOpen: true,
    type: 'section',
    sectionIndex: sectionIndex
  };
};

const openDeleteFormDialog = () => {
  deleteDialogState.value = {
    isOpen: true,
    type: 'form',
    sectionIndex: null
  };
};

const addQuestion = (index, sectionIndex) => {
  const newQuestion = {
    id: uuidv4(),
    type: "text",
    question: "",
    description: null,
    data: {},
    points: model.value.points || null
  };
  model.value.sections[sectionIndex].questions.splice(index, 0, newQuestion);

  nextTick(() => {
    scrollToReference(sectionIndex);
  });
};

const questionChange = (question, sectionIndex, questionIndex) => {
  if (question.data.options) {
    question.data.options = [...question.data.options];
  }
  if (question.points === undefined || question.points === null) {
    question.points = model.value.points || null;
  }
  model.value.sections[sectionIndex].questions = model.value.sections[sectionIndex].questions.map((q, index) =>
    index === questionIndex ? { ...question } : q
  );
};

const deleteQuestion = (sectionIndex, questionIndex) => {
  model.value.sections[sectionIndex].questions = model.value.sections[sectionIndex].questions.filter((_, index) => index !== questionIndex);
};

const updateQuestionsWithDefaultPoints = () => {
  model.value.sections.forEach(section => {
    section.questions.forEach(question => {
      if (question.points === null || question.points === undefined) {
        question.points = model.value.default_points;
      }
    });
  });
};

const updateFormTitle = (newTitle) => {
  draftStore.setFormTitle(newTitle);
  model.value.title = newTitle;
};

watch(() => model.value.default_points, updateQuestionsWithDefaultPoints);

watch(() => model.value, (newVal) => {
  if (!isSubmitting.value && draftStore.formState !== 'submitted' && JSON.stringify(newVal) !== initialModelState) {
    clearTimeout(saveTimeout);
    draftStore.setFormTitle(newVal.title);
    saveTimeout = setTimeout(async () => {
      try {
        await draftStore.createOrUpdateDraft(newVal);
        push.info({
          title: 'Saved as draft',
          message: 'Your work is saved as a draft until submission.'
        });
      } catch (error) {
        push.error({
          title: 'Draft failed',
          message: 'Failed to save draft. Will try again later.',
        });
      }
    }, 7 * 1000); // 7 second debounce
  }
}, { deep: true });

const storeForm = async () => {
  isSubmitting.value = true;
  const action = model.value.id ? "Updated" : "Created";
  const formData = prepareFormData();

  try {
    const response = await formStore.storeForm(formData);
    if (response?.data) {
      const { data } = response.data;
      if (draftStore.draftId) {
        await draftStore.deleteDraft(draftStore.draftId);
      }

      draftStore.setFormState('submitted');
      draftStore.clearDraft();

      router.push({ name: "FormEdit", params: { id: data.id } });
      push.success({
        title: `${action}`,
        message: `The form was successfully ${action.toLowerCase().trim()}`
      });

      updateModelWithResponseData(data);
    }
  } catch (error) {
    push.error({
      title: 'Submission failed',
      message: 'Failed to submit the form. Please try again.',
    });
  } finally {
    isSubmitting.value = false;
  }
};

const updateModelWithResponseData = (data) => {
  if (data.sections) {
    model.value.sections = data.sections.map(section => ({
      id: section.id,
      title: section.title,
      description: section.description,
      questions: (section.questions || []).map(question => ({
        ...question,
        points: model.value.is_quiz ? (question.points || data.default_points) : null
      })),
    }));
  }
  model.value.default_points = data.default_points;
};

const prepareFormData = () => {
  const sectionsData = model.value.sections.map(section => ({
    ...section,
    questions: section.questions.map(question => ({
      ...question,
      points: model.value.is_quiz
        ? (question.points !== model.value.default_points ? model.value.default_points : question.points)
        : null,
      data: question.data || null,
      description: question.description || null
    }))
  }));

  return {
    ...model.value,
    sections: sectionsData,
    default_points: model.value.is_quiz ? model.value.default_points : null,
  };
};

const performDelete = () => {
  if (deleteDialogState.value.type === 'form') {
    formStore.destroyForm(model.value.id).then(() => {
      router.push({ name: "Forms" });
      push.success({
        title: `Deleted`,
        message: `The form ${model.value.title} has been deleted`
      });
    });
  } else if (deleteDialogState.value.type === 'section') {
    const { sectionIndex } = deleteDialogState.value;
    if (sectionIndex !== null) {
      model.value.sections.splice(sectionIndex, 1);
    }
  }

  deleteDialogState.value = { isOpen: false, type: null, sectionIndex: null };
};

const questionDescriptionAsImage = (sectionIndex, questionIndex, description) => {
  model.value.sections[sectionIndex].questions[questionIndex].description = description;
};

const handleFilePondProcess = async (fieldName, file, metadata, load, error, progress, abort) => {
  try {
    const res = await uploadStore.processImage(file);
    load(res.data);
    model.value.image = res.data;
  } catch (err) {
    error('An error occurred');
  }
};

const handleFilePondRevert = async (uniqueFileId, load, error) => {
  try {
    await uploadStore.revert(uniqueFileId);
    load();
  } catch (err) {
    error('An error occurred');
  }
};

const toggleIsPublish = () => {
  isPublish.value = model.value.is_published;
};

const toggleIsQuiz = () => {
  isQuiz.value = model.value.is_quiz;
};

const scrollToReference = (sectionIndex) => {
  const button = referenceBtn.value[sectionIndex];
  if (button) {
    button.scrollIntoView({ behavior: 'smooth' });
  }
};

const getQuestionErrors = (sectionIndex, questionIndex) => {
  if (!formStore.error || !formStore.error.validation) return {};
  const errors = {};
  const prefix = `sections.${sectionIndex}.questions.${questionIndex}.`;
  for (const [key, value] of Object.entries(formStore.error.validation)) {
    if (key.startsWith(prefix)) {
      errors[key.replace(prefix, '')] = value;
    }
  }
  return errors;
};
</script>
