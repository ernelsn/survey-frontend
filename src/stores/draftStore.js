import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useDraftStore = defineStore("draft", {
  state: () => ({
    formTitle: "",
    data: {},
    savedToServer: false,
    draftId: null,
    drafts: [],
    formState: "unsaved",
    currentLocalStorageKey: null,
    isSubmitted: false,
  }),
  actions: {
    setFormTitle(title) {
      if (this.currentLocalStorageKey) {
        localStorage.removeItem(this.currentLocalStorageKey);
      }
      this.formTitle = title;
      this.currentLocalStorageKey = this.formTitle ? this.formTitle + '_form' : 'untitled_form';
      this.saveDraftLocally(this.data);
    },

    setFormState(state) {
      this.formState = state;
    },

    setSubmitted(value) {
      this.isSubmitted = value;
    },

    saveDraftLocally(data) {
      if (!this.currentLocalStorageKey) {
        this.currentLocalStorageKey = this.formTitle ? this.formTitle + '_form' : 'untitled_form';
      }
      localStorage.setItem(this.currentLocalStorageKey, JSON.stringify(data));
    },

    resetFormState() {
      this.formState = 'editing';
    },

    clearDraft() {
      if (this.currentLocalStorageKey) {
        localStorage.removeItem(this.currentLocalStorageKey);
      }
      this.data = {};
      this.formTitle = "";
      this.draftId = null;
      this.currentLocalStorageKey = null;
    },

    async saveAsDraft(data) {
      try {
        let response;
        if (this.draftId) {
          response = await axiosClient.put(`/api/v1/drafts/${this.draftId}`, {
            title: this.formTitle || "Untitled Form",
            data: data,
          });
        } else {
          response = await axiosClient.post("/api/v1/drafts", {
            title: this.formTitle || "Untitled Form",
            data: data,
          });
        }
        this.draftId = response.data.id;
        this.savedToServer = true;
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getFormDrafts() {
      try {
        const response = await axiosClient.get("/api/v1/drafts");
        this.drafts = response.data;
      } catch (error) {
        throw error;
      }
    },

    async loadSpecificDraft() {
      try {
        const response = await axiosClient.get(`/api/v1/drafts/${this.draftId}`);
        const serverData = response.data;
        if (serverData) {
          this.formTitle = serverData.title || 'Untitled Form';
          this.currentLocalStorageKey = this.formTitle + '_form';
          const parsedData = typeof serverData.data === 'string' ? JSON.parse(serverData.data) : serverData.data;
          this.saveDraftLocally(parsedData);
          Object.assign(this.data, parsedData);
        }
      } catch (error) {
        throw error;
      }
    },

    async deleteDraft(draftId) {
      try {
        await axiosClient.delete(`/api/v1/drafts/${draftId}`);
        this.drafts = this.drafts.filter((draft) => draft.id !== draftId);
        if (this.draftId === draftId) {
          this.draftId = null;
          this.data = {};
          this.formTitle = "";
        }
      } catch (error) {
        throw error;
      }
    },

    async createOrUpdateDraft(formData) {
      if (this.formState === 'submitted') {
        this.formState = 'editing';
      }
      await this.saveAsDraft(formData);
    },
  },
});
