<template>
  <PageComponent>
    <template v-slot:header>
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Forms</h2>
        </div>
        <div class="mt-5 flex lg:ml-4 lg:mt-0">
          <span class="sm:ml-3">
            <router-link :to="{ name: 'FormsCreate' }" class="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path
                  d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              New form
            </router-link>
          </span>
        </div>
      </div>
    </template>

    <div v-if="forms.loading" class="flex justify-center">
      <span class="loading loading-dots loading-lg"></span>
    </div>

    <div v-else-if="forms.data.length">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        <FormsLists v-for="(form, ind) in forms.data" :key="form.id" :form="form" class="opacity-0 animate-fade-in-down"
          :style="{ animationDelay: `${ind * 0.1}s` }" @delete="showDeleteDialog" />

        <DeleteFormDialog :isOpened="showDelete" @toggle="(value) => showDelete = value" :on-delete="performDelete"
          :title="dialogTitle" :message="dialogMessage" />
      </div>
      <div class="flex justify-center mt-5 border-t border-gray-200 ">
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm mt-5" aria-label="Pagination">
          <a v-for="(link, i) of forms.links" :key="i" :disabled="!link.url" href="#" @click="pagination($event, link)"
            aria-current="page"
            class="relative inline-flex items-center px-4 py-2 border text-sm font-medium whitespace-nowrap" :class="[
              link.active
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              i === 0 ? 'rounded-l-md bg-gray-100 text-gray-700' : '',
              i === forms.links.length - 1 ? 'rounded-r-md' : '',
            ]" v-html="link.label">
          </a>
        </nav>
      </div>
    </div>
    <div v-else class="text-gray-600 text-center py-16">
      No forms has been created yet.
    </div>
  </PageComponent>
</template>

<script setup>
import { ref, computed } from "vue";
import { useFormStore } from "../stores/formStore";
import { useDashboardStore } from '../stores/dashboardStore';

import PageComponent from "../components/PageComponent.vue";
import DeleteFormDialog from "../components/DeleteFormDialog.vue";
import FormsLists from "../components/FormsLists.vue";

const showDelete = ref(false);
const selectedForm = ref(null);

const formStore = useFormStore();
const dashboardStore = useDashboardStore();

const dialogTitle = computed(() => 'Delete Form');
const dialogMessage = computed(() => 'Are you sure you want to delete this form? All of the data pertaining to this form will be permanently removed. This action cannot be undone.');

const forms = computed(() => formStore.forms);

formStore.getForms();

function showDeleteDialog(id) {
  showDelete.value = true;
  selectedForm.value = id;
}

async function performDelete() {
  await formStore.destroyForm(selectedForm.value);
  dashboardStore.notify({
    intent: 'info',
    title: `Form deleted`,
    message: `The form was successfully deleted`
  });
  showDelete.value = false;
  await formStore.getForms();
}

function pagination(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }
  formStore.getForms({ url: link.url });
}
</script>
