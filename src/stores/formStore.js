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
      data: [],
    },
    currentForm: {
      data: {},
      loading: false,
      results: {},
      loadResults: false,
    },
    questionTypes: ["short answer", "paragraph", "multiple choice", "checkbox", "dropdown", "linear scale"],
    endTime: null,
    started: false,
    ended: false,
    formErrors: [],
  }),

  getters: {
    errors: (state) => state.formErrors,
  },

  actions: {
    async getForms(url = '/api/v1/forms') {
      this.forms.loading = true;
      try {
        const response = await formService.getForms(url);
        this.forms.data = response.data.data;
        this.forms.links = response.data.meta.links;
      } catch (err) {
        this.error = err;
      } finally {
        this.forms.loading = false;
      }
    },

    async fetchForm(id) {
      this.currentForm.loading = true;
      try {
        const response = await formService.fetchForm(id);
        this.currentForm.data = response.data.data;
        this.currentForm.loading = false;

        return response;
      } catch (err) {
        this.currentForm.loading = false;
        throw err;
      }
    },

    async getFormBySlug(slug) {
      this.currentForm.loading = true;
      try {
        const response = await formService.getFormBySlug(slug);
        this.currentForm.data = response.data.data;
        this.currentForm.loading = false;
        
        return response;
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
      const response = await formService.destroyForm(id);
      await this.getForms();
      return response;
    },

    async showResults(id) {
      this.currentForm.loadResults = true;
      const response = await formService.showResults(id);
      this.currentForm.results = response.data;
      this.currentForm.loadResults = false;
    },
  },  
  persist: {
    paths: ['endTime', 'started', 'ended', 'currentForm.results'],
  },
});
