import { defineStore } from 'pinia';
import axiosClient from '../axios';
import FormService from '../services/formService';

const formService = new FormService(axiosClient);

const handleErrors = (error) => {
  if (error.response.status === 422) {
    return error.response.data.errors || ["An error occurred while processing the request."];
  }
  
  return ["An error occurred while processing the request."];
}

export const useFormStore = defineStore('form', {

  state: () => ({
    forms: {
      loading: false,
      links: [],
      data: []
    },
    currentForm: {
      data: {},
      loading: false,
    },
    questionTypes: ["short answer", "paragraph", "multiple choice", "checkbox", "dropdown", "linear scale"],
    endTime: null,
    started: false,
    formErrors: [],
    results: {},
  }),

  getters: {
    errors: (state) => state.formErrors,
  },

  actions: {
    async getForms(url = '/api/v1/forms') {
      this.forms.loading = true;
      try {
        const res = await formService.getForms(url);
        this.forms.data = res.data.data;
        this.forms.links = res.data.meta.links;
      } catch (err) {
        this.error = err;
      } finally {
        this.forms.loading = false;
      }
    },

    async fetchForm(id) {
      this.currentForm.loading = true;
      try {
        const res = await formService.fetchForm(id);
        this.currentForm.data = res.data.data;
        this.currentForm.loading = false;

        return res;
      } catch (err) {
        this.currentForm.loading = false;
        throw err;
      }
    },

    async getFormBySlug(slug) {
      this.currentForm.loading = true;
      try {
        const res = await formService.getFormBySlug(slug);
        this.currentForm.data = res.data.data;
        this.currentForm.loading = false;
        
        return res;
      } catch (err) {
        this.currentForm.loading = false;
        throw err;
      }
    },

    async storeForm(form) {
      delete form.image_url;
      let response;
      try {
        if (form.id) {
          response = await formService.storeForm(form);
          this.currentForm.data = response.data.data;
        } else {
          response = await formService.storeForm(form);
          this.currentForm.data = response.data.data;
        }
        return response;
      } catch(error) {
        this.formErrors = handleErrors(error);
      }
    },

    async storeFormResponse({formId, responses}) {
      return formService.storeFormResponse(formId, responses);
    },

    async destroyForm(id) {
      const res = await formService.destroyForm(id);
      await this.getForms();
      return res;
    },

    async showResults(id) {
      const res = await formService.showResults(id);
      this.results = res.data;
    },
  },  
  persist: {
    paths: ['endTime', 'started'],
  },
});
