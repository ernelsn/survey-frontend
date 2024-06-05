import { defineStore } from 'pinia';

export const useDraftStore = defineStore('draft', {
  state: () => ({
    formTitle: "",
    data: {
      title: "",
      slug: "",
      description: null,
      image: null,
      image_url: null,
      expire_date: null,
      time_limit: null,
      is_published: false,
      show_results: false,
      multiple_attempts: false,
      questions: [],
    },
    draftLoaded: false,
  }),
  actions: {
    setFormTitle(title) {
      this.formTitle = title;
    },

    setDraftLoaded(value) {
      this.draftLoaded = value;
    },

    saveAsDraft(data) {
      const key = this.formTitle + '_form';
      localStorage.setItem(key, JSON.stringify(data));
    },

    loadAsDraft() {
      const keys = Object.keys(localStorage);
      const formKey = keys.find(key => key.endsWith('_form'));
      if (formKey) {
        const retrievedModelDraft = localStorage.getItem(formKey);
        if (retrievedModelDraft) {
          Object.assign(this.data, JSON.parse(retrievedModelDraft));
          this.formTitle = formKey.replace('_form', '');
        }
      }
    },

    clearDraft() {
      const key = this.formTitle + '_form';
      localStorage.removeItem(key);
      this.data = {};
    },
  },
});
