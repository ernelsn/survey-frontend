<template>
    <PageComponent>
        <div v-if="loading" class="flex justify-center">
            <span class="loading loading-dots loading-lg"></span>
        </div>
        <div class="card bg-base-100 shadow-xl mb-2">
            <div class="card-body">
                <div class="lg:flex lg:items-center lg:justify-between">
                    <div class="min-w-0 flex-1">
                        <h2 v-if="responses.form_responses_count"
                            class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            {{
                                responses.form_responses_count }} responses</h2>
                    </div>
                    <div class="mt-5 flex lg:ml-4 lg:mt-0">
                        <span class="hidden sm:block">
                            <input type="checkbox" class="peer sr-only opacity-0" id="toggle" />
                            <label for="toggle"
                                class="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-400 px-0.5 outline-gray-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-slate-900 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-slate-700">
                                <span class="sr-only">Enable</span>
                            </label>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">

            </div>
        </div>
    </PageComponent>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useFormResponseStore } from '../stores/formResponseStore';
import PageComponent from "../components/PageComponent.vue";

const route = useRoute();
const formResponseStore = useFormResponseStore();

const loading = computed(() => formResponseStore.currentForm.loading);
const responses = computed(() => formResponseStore.currentForm.data);

onMounted(() => {
    formResponseStore.getFormResponse(route.params.id);
});
</script>