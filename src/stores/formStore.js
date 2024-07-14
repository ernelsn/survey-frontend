import { defineStore } from 'pinia';
import axiosClient from '../axios';
import FormService from '../services/formService';

const formService = new FormService(axiosClient);

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
      sectionLoading: false,
    },
    questionCorrectOptions: {},
    questionTypes: ["short answer", "paragraph", "multiple choice", "checkbox", "dropdown", "linear scale"],
    error: null,
  }),

  actions: {
    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    async getForms(url = '/api/v1/forms') {
      this.forms.loading = true;
      this.setError(null);
      try {
        const response = await formService.getForms(url);
        this.forms.data = response.data.data;
        this.forms.links = response.data.meta.links;
      } catch (err) {
        this.setError(handleErrors(err));
      } finally {
        this.forms.loading = false;
      }
    },

    async getForm(id) {
      this.currentForm.loading = true;
      this.setError(null);
      try {
        const response = await formService.getForm(id);
        this.currentForm.data = response.data.data;
        return response;
      } catch (error) {
        this.setError(error);
        throw error;
      } finally {
        this.currentForm.loading = false;
      }
    },

    async getFormBySlug(slug) {
      this.currentForm.loading = true;
      this.setError(null);
      this.currentForm.data = { title: '' };
    
      try {
        const response = await formService.getFormBySlug(slug);
        this.currentForm.data = response.data.data;
      } catch (err) {
        if (err.response && err.response.data) {
          this.setError(err.response.data.message);
          this.currentForm.data.title = err.response.data.title;
        } else if (err.request) {
          this.setError('No response received from the server');
        } else {
          this.setError('An error occurred while setting up the request');
        }
      } finally {
        this.currentForm.loading = false;
      }
    },

    async storeForm(form) {
      let response;
      try {
        if (form.id) {
          this.currentForm.sectionLoading = true;
          response = await formService.storeForm(form);
          this.currentForm.data = response.data.data;
        } else {
          this.currentForm.loading = true;
          response = await formService.storeForm(form);
          this.currentForm.data = response.data.data;
        }
        return response;
      } catch(error) {
        this.setError(error);
      } finally {
        this.currentForm.loading = false;
        this.currentForm.sectionLoading = false;
      }
    },

    async updateFormResponseAcceptance(id) {
      try {
        const response = await formService.updateFormResponseAcceptance(id);
        return response.data
      } catch (error) {
        console.error('Error updating form response acceptance:', error)
        throw error
      }
    },

    async destroyForm(id) {
      const response = await formService.destroyForm(id);
      await this.getForms();
      return response;
    },
  },
});
