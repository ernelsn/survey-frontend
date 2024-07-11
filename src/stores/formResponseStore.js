import { defineStore } from 'pinia';
import axiosClient from '../axios';
import FormResponseService from '../services/formResponseService';

const formResponseService = new FormResponseService(axiosClient);

export const useFormResponseStore = defineStore('response', {
  state: () => ({
    currentForm: {
      data: null,
      loading: false,
      error: null,
    },
    results: {
      overall_results: {
        total_questions: 0,
        total_correct_responses: 0,
      },
      section_results: [],
    },
    loadResults: false,
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
    async getFormResponse(id) {
      this.currentForm.loading = true;
      this.currentForm.error = null;
      try {
        const response = await formResponseService.getFormResponse(id);
        this.currentForm.data = response.data;
      } catch (error) {
        console.error('Error fetching form response:', error);
        this.currentForm.error = error.message || 'An error occurred while fetching the form response.';
      } finally {
        this.currentForm.loading = false;
      }
    },

    async storeFormResponse({formId, responses}) {
      return formResponseService.storeFormResponse(formId, responses);
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
  },
  persist: {
    paths: ['endTime', 'started', 'ended', 'results'],
  },
});
