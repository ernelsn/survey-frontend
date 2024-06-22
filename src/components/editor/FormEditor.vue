<template>
  <div class="mt-6 flex items-center justify-between">
    <h2 class="text-base font-semibold leading-7 text-gray-900">{{ questionIndex + 1 }}. {{ model.question }}</h2>
    <button type="button" @click="deleteQuestion()" class="btn btn-circle btn-outline btn-error btn-xs">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
    <div class="sm:col-span-4 sm:col-start-1">
      <label for="'question_text_' + model.data"
        class="block text-sm font-medium leading-6 text-gray-900">Question</label>
      <div class="mt-2">
        <input type="text"
          class="input input-bordered w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
          :name="'question_text_' + model.data" v-model="model.question" @change="dataChange"
          :id="'question_text_' + model.data">
      </div>
    </div>

    <div class="sm:col-span-2">
      <label for="question_type" class="block text-sm font-medium leading-6 text-gray-900">Type</label>
      <div class="mt-2">
        <select id="question_type" name="question_type" v-model="model.type" @change="typeChange"
          class="select select-bordered w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6">
          <option v-for="type in questionTypes" :key="type" :value="type">{{ upperCaseFirst(type) }}</option>
        </select>
      </div>
    </div>

    <div class="col-span-full">
      <label :for="'question_description_' + model.id"
        class="text-sm font-medium leading-6 text-gray-900 flex items-center justify-between">
        Description
        <div class="flex gap-x-3">
          <button type="button" class="btn btn-xs btn-circle" @click="toggleText">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </button>

          <button type="button" class="btn btn-xs btn-circle" @click="toggleFilePond">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        </div>
      </label>
      <div v-if="model.description_url && !showTextarea"
        class="mt-2 relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
        <img v-if="model.description_url" :src="model.description_url" v-fullscreen-image="{
          imageUrl: model.description_url,
          withDownload: false,
          animation: 'fade',
        }" class="h-full w-full object-cover object-center">
      </div>
      <div class="mt-2 col-span-full">
        <textarea v-if="showTextarea" :name="'question_description_' + model.id" v-model="model.description"
          @change="dataChange" :id="'question_description_' + model.id"
          class="textarea textarea-bordered textarea-xs w-full py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"></textarea>

        <editor-file-pond v-if="showFilePond" :name="'question_description_' + model.id" v-model="model.description"
          @change="dataChange" id="description" ref="form-editor-pond" class-name="form-editor-pond"
          label-idle="Drop files here..." credits="false" allow-multiple="true"
          accepted-file-types="image/jpeg, image/png" :server="{
            url: '',
            process: handleFilePondProcess,
            revert: handleFilePondRevert,
          }" />
      </div>
    </div>

    <div v-if="hasOptions()" class="col-span-full">
      <div v-if="model.data.options && !model.data.options.length" class="text-xs text-gray-600 text-center py-3">
        You don't have any options defined
      </div>

      <label v-if="model.data.options && model.type != 'linear scale'"
        class="block text-xs font-medium leading-6 text-gray-900">Correct</label>

      <div v-for="(option, index) in model.data.options" :key="option.uuid">
        <fieldset v-if="model.type === 'linear scale'">
          <div class="flex items-center gap-x-3 space-y-1">
            <select
              class="select select-sm select-bordered w-1/6 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
              v-model="option.from_option" @change="dataChange">
              <option disabled selected>From</option>
              <option v-for="n in [0, 1]" :key="n" :value="n">{{ n }}</option>
            </select>
            <input type="text"
              class="input input-bordered input-sm w-full py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
              v-model="option.from_label" @change="dataChange" />
          </div>
          <div class="flex items-center gap-x-3">
            <select
              class="select select-sm select-bordered w-1/6 py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
              v-model="option.to_option" @change="dataChange">
              <option disabled selected>To</option>
              <option v-for="n in [2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="n" :value="n">{{ n }}</option>
            </select>
            <input type="text"
              class="input input-bordered input-sm w-full py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
              v-model="option.to_label" @change="dataChange" />
          </div>
        </fieldset>
        <fieldset v-else>
          <div class="flex items-center gap-x-3 space-y-1">
            <input v-if="model.type === 'multiple choice' || model.type === 'dropdown'" type="radio" class="radio"
              v-model="model.correct_option" :value="option.uuid" :name="'is_correct_' + model.id"
              :id="'is_correct_' + model.id" @change="dataChange" :checked="option.is_correct" />
            <input v-if="model.type === 'checkbox'" type="checkbox" class="checkbox" :name='"option" + index'
              :value="option.uuid" @change="checkboxOption(option)" :checked="option.is_correct" />

            <input type="text"
              class="input input-bordered input-sm w-full py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6"
              v-model="option.text" @change="dataChange" />

            <button type="button" @click="manageOptions('remove', option)"
              class="btn btn-circle btn-outline btn-error btn-xs">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                <path
                  d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
              </svg>
            </button>
          </div>
        </fieldset>
      </div>
      <div v-if="model.type != 'linear scale'">
        <button class="btn btn-xs mt-3" type="button" @click="manageOptions('add')">
          <span class="text-gray-600">Add option</span>
        </button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "vue";
import { useFormStore } from "../../stores/formStore";
import { useUploadStore } from "../../stores/uploadStore";

import vueFilePond from 'vue-filepond';

import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

const EditorFilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);

const formStore = useFormStore();
const uploadStore = useUploadStore();

const showTextarea = ref(true);
const showFilePond = ref(false);

const props = defineProps({
  question: Object,
  questionIndex: Number,
  sectionIndex: Number,
});

const emit = defineEmits(["change", "addQuestion", "deleteQuestion", "scrollToReference", "questionDescriptionAsImage"]);

const model = ref({
  ...JSON.parse(JSON.stringify(props.question)),
});

const questionTypes = computed(() => formStore.questionTypes);

const selectedOption = computed(() => {
  return model.value.data.options.find(option => option.uuid === model.value.correct_option);
});

function upperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function hasOptions() {
  return ["multiple choice", "checkbox", "dropdown", "linear scale"].includes(model.value.type);
}

function manageOptions(action, option) {
  if (action === "add") {
    model.value.data.options = [
      ...model.value.data.options,
      { uuid: uuidv4(), text: "" },
    ];
  } else if (action === "remove") {
    model.value.data.options = model.value.data.options.filter(
      (opt) => opt !== option
    );
  }
  dataChange();
}

function typeChange() {
  if (hasOptions()) {
    if (!model.value.data.options || !model.value.data.options.length) {
      model.value.data.options = [{ uuid: uuidv4(), text: "" }];
    }
  }
  dataChange();
  emit('scrollToReference', props.sectionIndex, props.questionIndex);
}

function dataChange() {
  if (["multiple choice", "dropdown"].includes(model.value.type)) {
    // For radio buttons, only one option can be correct.
    for (const option of model.value.data.options) {
      option.is_correct = option.uuid === model.value.correct_option;
    }
  }
  const data = model.value;
  if (!hasOptions()) {
    delete data.data.options;
  }
  emit("change", data);
}

function deleteQuestion() {
  emit("deleteQuestion", props.question);
}

function checkboxOption(option) {
  option.is_correct = !option.is_correct;
  dataChange();
}

if (model.value.description_url) {
  showFilePond.value = true;
  showTextarea.value = false;
}

function toggleText() {
  showTextarea.value = true;
  showFilePond.value = false;
}

function toggleFilePond() {
  showFilePond.value = true;
  showTextarea.value = false;
}

async function handleFilePondProcess(fieldName, file, metadata, load, error, progress, abort) {
  try {
    const res = await uploadStore.processDescriptionAsImage(file);
    load(res.data);
    emit('questionDescriptionAsImage', props.sectionIndex, props.questionIndex, res.data );
  } catch (err) {
    console.error('Error occurred:', err);
    error('An error occurred');
  }
}

async function handleFilePondRevert(uniqueFileId, load, error) {
  try {
    await uploadStore.revert(uniqueFileId);
    load();
  } catch (err) {
    error('An error occurred');
  }
}
</script>
