<template>
  <fieldset class="mb-4">
    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text font-medium text-gray-900">{{ index + 1 }}. {{ question.question }}</span>
        </div>
        <div class="label">
          <span class="label-text text-gray-500 text-sm">{{ question.description }}</span>
        </div>
      </label>
    </div>
    <div class="mt-3">
      <div v-if="question.type === 'dropdown'">
        <select :value="modelValue" @change="emits('update:modelValue', $event.target.value)"
          class="select select-bordered w-full">
          <option disabled selected>Please Select</option>
          <option v-for="option in question.data.options" :key="option.uuid" :value="option.text">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div v-else-if="question.type === 'multiple choice'">
        <div v-for="(option, ind) of question.data.options" :key="option.uuid" class="form-control flex items-start ">
          <label class="label cursor-pointer gap-x-4">
            <input :id="option.uuid" :name="'question' + question.id" :value="option.text" @change="emits('update:modelValue', $event.target.value)" type="radio" class="radio" />
            <span class="label-text" :for="option.uuid">{{ option.text }}</span>
          </label>
        </div>
      </div>

      <div v-else-if="question.type === 'checkbox'">
        <div v-for="(option, ind) of question.data.options" :key="option.uuid" class="form-control flex items-start ">
          <label class="label cursor-pointer gap-x-4">
            <input :id="option.uuid" v-model="model[option.text]" @change="onCheckboxChange" type="checkbox" class="checkbox" />
            <span class="label-text" :for="option.uuid">{{ option.text }}</span>
          </label>
        </div>
      </div>

      <div v-else-if="question.type === 'short answer'">
        <input type="text" :value="modelValue" @input="emits('update:modelValue', $event.target.value)"
          class="input input-bordered w-full" />
      </div>

      <div v-else-if="question.type === 'paragraph'">
        <textarea :value="modelValue" @input="emits('update:modelValue', $event.target.value)"
        class="textarea textarea-bordered"></textarea>
      </div>

    </div>
  </fieldset>
  <hr class="mb-4" />
</template>

<script setup>
import { ref } from "vue";
const { question, index, modelValue } = defineProps({
  question: Object,
  index: Number,
  modelValue: [String, Array],
});
const emits = defineEmits(["update:modelValue"]);

let model;
if (question.type === "checkbox") {
  model = ref({});
}

function hasOptions() {
  return ["multiple choice", "checkbox", "dropdown"].includes(question.type);
}

function onCheckboxChange($event) {
  const selectedOptions = [];
  for (let uuid in model.value) {
    if (model.value[uuid]) {
      selectedOptions.push(uuid);
    }
  }
  emits("update:modelValue", selectedOptions);
}
</script>
