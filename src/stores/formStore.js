import { defineStore } from "pinia";
import axiosClient from "../axios";
import FormService from "../services/formService";

const formService = new FormService(axiosClient);

export const useFormStore = defineStore("form", {
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
    questionTypes: [
      "short answer",
      "paragraph",
      "multiple choice",
      "checkbox",
      "dropdown",
      "linear scale",
    ],
    error: null,
  }),

  actions: {
    clearError() {
      this.error = null;
    },

    setFormData(draftData) {
      this.currentForm.data = draftData;
    },

    setError(error) {
      this.error = {
        status: error.status,
        title: error.title,
        message: error.message,
        validation: error.validation,
      };
    },

    handleNotFound(err) {
      this.setError({
        status: 404,
        title: "Form not found",
        message: "Sorry, we couldn't find the form you're looking for.",
        validation: {},
      });
    },

    handleExpired(err) {
      this.setError({
        status: 410,
        title: "Access has expired",
        message: "This form is no longer available.",
        validation: {},
      });
    },
    
    handleAlreadySubmitted(err) {
      this.setError({
        status: 403,
        title: "You've already responded",
        message: "You can fill out this form only once.",
        validation: {},
      });
    },

    async getForms(url = "/api/v1/forms") {
      this.forms.loading = true;
      this.clearError();
      try {
        const response = await formService.getForms(url);
        this.forms.data = response.data.data;
        this.forms.links = response.data.meta.links;
      } catch (error) {
        if (error.response) {
          this.setError({
            status: error.response.status,
            message: error.response.data.message || 'An error occurred while fetching forms',
            validation: error.response.data.errors || {},
          });
        } else if (error.request) {
          this.setError({
            message: 'No response received from the server. Please check your network connection.',
          });
        } else {
          this.setError({
            message: error.message || 'An error occurred while setting up the request',
          });
        }
      } finally {
        this.forms.loading = false;
      }
    },

    async getForm(id) {
      this.currentForm.loading = true;
      this.clearError();
      try {
        const response = await formService.getForm(id);
        this.currentForm.data = response.data.data;
        return response;
      } catch (error) {
        this.setError({
          status: error.response?.status,
          title: "Error Fetching Form",
          message: error.response?.data?.message || "An error occurred while fetching the form",
          validation: error.response?.data?.errors || {},
        });
        throw error;
      } finally {
        this.currentForm.loading = false;
      }
    },

    async getFormBySlug(slug) {
      this.currentForm.loading = true;
      this.clearError();
      this.currentForm.data = { title: "" };
      try {
        const response = await formService.getFormBySlug(slug);
        this.currentForm.data = response.data.data;
      } catch (error) {
        if (error.status === 404) {
          this.handleNotFound(error);
        } else if (error.status === 410) {
          this.handleExpired(error);
        } else if (error.status === 403) {
          this.handleAlreadySubmitted(error);
        } else {
          this.setError(error);
        }
        this.currentForm.data.title = error.original?.response?.data?.title || "";
      } finally {
        this.currentForm.loading = false;
      }
    },

    async storeForm(form) {
      this.currentForm.loading = true;
      this.clearError();
      let response;
      try {
        if (form.id) {
          this.currentForm.sectionLoading = true;
          response = await formService.storeForm(form);
          this.currentForm.data = response.data.data;
        } else {
          response = await formService.storeForm(form);
          this.currentForm.data = response.data.data;
        }
        return response;
      } catch (error) {
        this.setError({
          status: error.status,
          title: error.status === 422 ? "Validation Error" : "Error occurred",
          message: error.message || "An unexpected error occurred",
          validation: error.validation || {},
        });
      } finally {
        this.currentForm.loading = false;
        this.currentForm.sectionLoading = false;
      }
    },

    async updateFormResponseAcceptance(id) {
      try {
        const response = await formService.updateFormResponseAcceptance(id);
        return response.data;
      } catch (error) {
        this.setError(error);
        throw error;
      }
    },

    async destroyForm(id) {
      const response = await formService.destroyForm(id);
      await this.getForms();
      return response;
    },
  },
});
