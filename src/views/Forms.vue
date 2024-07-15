<template>
  <PageComponent>
    <template v-slot:header>
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Forms</h2>
        </div>
        <div class="mt-5 flex lg:ml-4 lg:mt-0">
          <span class="sm:ml-3">
            <router-link :to="{ name: 'FormCreate' }" class="btn btn-ghost">
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

    <div v-else-if="!forms.loading">
      <div v-if="draftStore.drafts.length" class="relative card bg-base-100 shadow-xl p-4">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          <div v-for="draft in draftStore.drafts" :key="draft.id">
            <div class="flex flex-col py-4 px-6 bg-slate-50 hover:bg-slate-200 rounded-md">
              <h5 class="mt-4 text-md font-bold">{{ draft.title }} <div class="badge badge-neutral">Draft</div>
              </h5>
              <div class="flex justify-end items-center mt-3 gap-3">
                <router-link :to="{ name: 'FormEdit', query: { draft: draft.id } }" class="btn btn-sm btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                    <path
                      d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                    <path
                      d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                  </svg>
                  Load draft
                </router-link>
                <button v-if="draft.id" type="button" @click="deleteDraft(draft.id)"
                  class="btn btn-sm btn-square btn-error">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd"
                      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="forms.data.length" class="relative card bg-base-100 shadow-xl mt-3 p-4">
        <div>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            <FormContent v-for="(form, ind) in forms.data" :key="form.id" :form="form"
              class="opacity-0 animate-fade-in-down" :style="{ animationDelay: `${ind * 0.1}s` }"
              @delete="showDeleteDialog" />
          </div>
          <div class="flex justify-center mt-5 border-t border-gray-200 ">
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm mt-5" aria-label="Pagination">
              <a v-for="(link, i) of forms.links" :key="i" :disabled="!link.url" href="#"
                @click="pagination($event, link)" aria-current="page"
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
      </div>
    </div>
    <div v-else class="relative card bg-base-100 shadow-xl mt-3">
      <p class="text-gray-600 text-center py-16">No forms has been created yet</p>
    </div>

    <DeleteFormDialog :isOpened="showDelete" @toggle="(value) => showDelete = value" :on-delete="performDelete"
      :title="dialogTitle" :message="dialogMessage" />
  </PageComponent>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { push } from 'notivue';

import { useFormStore } from "../stores/formStore";
import { useDraftStore } from "../stores/draftStore";

import PageComponent from "../components/PageComponent.vue";
import DeleteFormDialog from "../components/DeleteFormDialog.vue";
import FormContent from "../components/FormContent.vue";

const showDelete = ref(false);
const selectedForm = ref(null);

const formStore = useFormStore();
const draftStore = useDraftStore();

const dialogTitle = computed(() => 'Delete Form');
const dialogMessage = computed(() => 'Are you sure you want to delete this form? All of the data pertaining to this form will be permanently removed. This action cannot be undone.');

const forms = computed(() => formStore.forms);

onMounted(() => {
  formStore.getForms();
  draftStore.getFormDrafts();
})

function showDeleteDialog(id) {
  showDelete.value = true;
  selectedForm.value = id;
}

async function performDelete() {
  await formStore.destroyForm(selectedForm.value);
  push.success({
    title: `Deleted`,
    message: `The form ${forms.title} was deleted`
  });
  showDelete.value = false;
  await formStore.getForms();
}

async function deleteDraft(draftId) {
  await draftStore.deleteDraft(draftId);
  push.success({
    title: `Deleted`,
    message: `The draft was deleted`
  });
  await draftStore.getFormDrafts();
}

async function pagination(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }
  await formStore.getForms({ url: link.url });
}
</script>
