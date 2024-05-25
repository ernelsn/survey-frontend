<template>

  <div class="flex items-center justify-between">
    <h3 class="text-lg font-bold">{{ index + 1 }}. {{ model.question }}</h3>

    <div class="flex items-center gap-x-2">
      <button type="button" @click="deleteQuestion()" class="btn btn-circle btn-outline btn-error btn-xs">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
    <label class="form-control w-full col-span-2">
      <div class="label">
        <span class="label-text text-sm font-medium text-gray-700">Question</span>
      </div>
      <input type="text" :name="'question_text_' + model.data" v-model="model.question" @change="dataChange"
        :id="'question_text_' + model.data" class="input input-bordered w-full">
    </label>

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text text-sm font-medium text-gray-700">Question type</span>
      </div>
      <select id="question_type" name="question_type" v-model="model.type" @change="typeChange"
        class="select select-bordered w-full">
        <option v-for="type in questionTypes" :key="type" :value="type">{{ upperCaseFirst(type) }}</option>
      </select>
    </label>
  </div>

  <label class="form-control w-full">
    <div class="label">
      <span class="label-text text-sm font-medium text-gray-700">Description</span>
    </div>
    <textarea :name="'question_description_' + model.id" v-model="model.description" @change="dataChange"
      :id="'question_description_' + model.id" class="textarea textarea-bordered textarea-xs w-full"></textarea>
  </label>

  <div>
    <div v-if="hasOptions()" class="mt-2">

      <div v-if="model.data.options && !model.data.options.length" class="text-xs text-gray-600 text-center py-3">
        You don't have any options defined
      </div>

      <h4 class="text-sm font-semibold mb-1 flex justify-between items-center">
        Correct
      </h4>
      <div v-for="(option, index) in model.data.options" :key="option.uuid" class="flex items-center mb-1 gap-x-3">
        <input v-if="model.type === 'multiple choice'" type="radio" class="radio" v-model="model.correct_option"
          :value="option.uuid" name="is_correct" @change="dataChange" :checked="option.is_correct" />

        <input v-if="model.type === 'checkbox'" type="checkbox" class="checkbox" :name='"option" + index'
          :value="option.uuid" @change="checkboxOption(option)" :checked="option.is_correct" />

        <input type="text" class="input input-bordered input-sm w-full" tabindex="1" v-model="option.text"
          @change="dataChange" />
        <button type="button" @click="manageOptions('remove', option)"
          class="btn btn-circle btn-outline btn-error btn-xs">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
            <path
              d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </button>
      </div>

      <button class="btn btn-xs" type="button" @click="manageOptions('add')">
        <span class="text-gray-600">Add option</span>
      </button>
    </div>
  </div>

  <hr class="my-4" />
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "vue";
import { useSurveyStore } from "../../stores/surveyStore";

const surveyStore = useSurveyStore();

const props = defineProps({
  question: Object,
  index: Number,
});

const emit = defineEmits(["change", "addQuestion", "deleteQuestion"]);

const model = ref({
  ...JSON.parse(JSON.stringify(props.question)),
  correct_option: null,
});

const questionTypes = computed(() => surveyStore.questionTypes);

const selectedOption = computed(() => {
  return model.value.data.options.find(option => option.uuid === model.value.correct_option);
});

function upperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function hasOptions() {
  return ["multiple choice", "checkbox", "dropdown"].includes(model.value.type);
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
}

function checkboxOption(option) {
  option.is_correct = !option.is_correct;
  dataChange();
}

function dataChange() {
  if (model.value.type === 'multiple choice') {
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

function addQuestion() {
  emit("addQuestion", props.index + 1);
}

function deleteQuestion() {
  emit("deleteQuestion", props.question);
}
</script>
