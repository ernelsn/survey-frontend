import { defineStore } from 'pinia';
import axiosClient from '../axios';
import FormResponseService from '../services/formResponseService';

const formResponseService = new FormResponseService(axiosClient);

export const useFormResponseStore = defineStore('response', {
  state: () => ({
    currentForm: {
      data: null,
      loading: false,
    },
    results: {
      overall_results: {
        total_questions: 0,
        total_correct_responses: 0,
      },
      section_results: [],
    },
    loadResults: false,
    error: null,
    startTime: null,
    endTime: null,
    started: false,
    ended: false,
  }),

  getters: {
    formResponses: (state) => state.currentForm.data?.form_responses || [],
    formResponsesCount: (state) => state.currentForm.data?.form_responses_count || 0
  },

  actions: {
    setError(error) {
      this.error = {
        status: error.status,
        title: error.title,
        message: error.message,
        validation: error.validation,
      };
    },

    clearError() {
      this.error = null;
    },

    async getFormResponse(id) {
      this.currentForm.loading = true;
      this.error = null;
      try {
        const response = await formResponseService.getFormResponse(id);
        this.currentForm.data = response.data;
      } catch (error) {
        console.error('Error fetching form response:', error);
        this.error = error.message || 'An error occurred while fetching the form response.';
      } finally {
        this.currentForm.loading = false;
      }
    },

    async storeFormResponse({formId, responses}) {
      this.clearError();
      try {
        return formResponseService.storeFormResponse(formId, responses);
      } catch(error) {
        this.setError({
          status: error.status,
          title: error.status === 422 ? "Validation Error" : "Error occurred",
          message: error.message || "An unexpected error occurred",
          validation: error.validation || {},
        });
      }
    },

    async showResults(id) {
      this.loadResults = true;
      try {
        const response = await formResponseService.showResults(id);
        this.results = response.data;
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        this.loadResults = false;
      }
    },

    async deleteResponse(formId, responseId) {
      const response = await formResponseService.deleteResponse(formId, responseId);
      return response;
    },
  },
  persist: {
    paths: ['endTime', 'started', 'ended'],
  },
});
