<template>
    <PageComponent>
        <div v-if="loading" class="flex justify-center">
            <span class="loading loading-dots loading-lg"></span>
        </div>
        <div v-else-if="formResponseStore.currentForm.error" class="text-center py-4 text-red-500">
            {{ formResponseStore.currentForm.error }}
        </div>
        <div v-else>
            <div class="card bg-base-100 shadow-xl mb-2">
                <div class="card-body">
                    <div class="lg:flex lg:items-center lg:justify-between">
                        <div class="min-w-0 flex-1">
                            <h2
                                class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                {{ responseMessage }}
                            </h2>
                        </div>
                        <div class="mt-5 flex items-center lg:ml-4 lg:mt-0">
                            <span class="mr-3">{{ isAccepting ? 'Accepting responses' : 'No longer accepting responses' }}</span>
                            <span class="sm:block">
                                <input type="checkbox" class="peer sr-only opacity-0" id="toggle"
                                    @change="toggleAcceptance" :checked="isAccepting" />
                                <label for="toggle"
                                    class="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-slate-900 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-slate-700">
                                    <span class="sr-only">Enable</span>
                                </label>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="formResponsesCount != 0" class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>
                                        <label>
                                            <input type="checkbox" class="checkbox" />
                                        </label>
                                    </th>
                                    <th>Name</th>
                                    <th>Score</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="response in formResponses" :key="response.id">
                                    <th>
                                        <label>
                                            <input type="checkbox" class="checkbox" />
                                        </label>
                                    </th>
                                    <td>
                                        <div class="flex items-center gap-3">
                                            <div>
                                                <div class="font-bold">{{ response.name }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>

                                    </td>
                                    <th>
                                        <button class="btn btn-ghost btn-xs"
                                            @click="showDetails(response.id)">Details</button>
                                    </th>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Score</th>
                                    <th></th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </PageComponent>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useFormResponseStore } from '../stores/formResponseStore';
import { useFormStore } from "../stores/formStore";
import PageComponent from "../components/PageComponent.vue";

const route = useRoute();
const formResponseStore = useFormResponseStore();
const formStore = useFormStore();
const loading = computed(() => formResponseStore.currentForm.loading);
const formResponses = computed(() => formResponseStore.formResponses);
const formResponsesCount = computed(() => formResponseStore.formResponsesCount);

const isAccepting = ref(false);

const responseMessage = computed(() => {
    if (formResponsesCount.value === 0) {
        return 'No response has been made yet';
    }
    const text = formResponsesCount.value === 1 ? 'response' : 'responses';
    return `${formResponsesCount.value} ${text}`;
});

onMounted(async () => {
  await formResponseStore.getFormResponse(route.params.id);
  isAccepting.value = formResponseStore.currentForm.data?.form_responses[0]?.is_accepting ?? false;
});

async function toggleAcceptance() {
  try {
    isAccepting.value = !isAccepting.value;
    const response = await formStore.updateFormResponseAcceptance(route.params.id);
    if (response && typeof response.is_accepting !== 'undefined') {
      isAccepting.value = response.is_accepting;
    }
  } catch (error) {
    console.error('Error toggling acceptance:', error);
    isAccepting.value = !isAccepting.value;
  }
}
</script>