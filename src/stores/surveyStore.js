import { defineStore } from 'pinia';
import axiosClient from '../axios';
import SurveyService from '../services/surveyService';

const surveyService = new SurveyService(axiosClient);

export const useSurveyStore = defineStore('survey', {

  state: () => ({
    surveys: {
      loading: false,
      links: [],
      data: []
    },
    currentSurvey: {
      data: {},
      loading: false,
    },
    questionTypes: ["short answer", "paragraph", "multiple choice", "checkbox", "dropdown", "linear scale"],
    endTime: null,
    timerId: null,
    timeLeft: null,
    now: Date.now(),
  }),

  actions: {
    async getSurveys(url = '/api/v1/survey') {
      this.surveys.loading = true;
      try {
        const res = await surveyService.getSurveys(url);
        this.surveys.data = res.data.data;
        this.surveys.links = res.data.meta.links;
      } catch (err) {
        this.error = err;
      } finally {
        this.surveys.loading = false;
      }
    },

    async fetchSurvey(id) {
      this.currentSurvey.loading = true;
      try {
        const res = await surveyService.fetchSurvey(id);
        this.currentSurvey.data = res.data.data;
        this.currentSurvey.loading = false;
        return res;
      } catch (err) {
        this.currentSurvey.loading = false;
        throw err;
      }
    },

    async getSurveyBySlug(slug) {
      this.resetTimer();
      this.currentSurvey.loading = true;
      try {
        const res = await surveyService.getSurveyBySlug(slug);
        this.currentSurvey.data = res.data.data;
        let startTimeKey = 'startTime-' + slug;
        let startTime = localStorage.getItem(startTimeKey);
        if (startTime === null) {
          startTime = Date.now();
          localStorage.setItem(startTimeKey, startTime);
        }
        let timeLimit = Number(res.data.data.time_limit);
        let endTime = Number(startTime) + timeLimit * 1000;
        this.endTime = endTime;
        this.currentSurvey.loading = false;
        let timerId = setInterval(() => {
          this.now = Date.now();
          if (this.timeLeft > 0) {
            this.timeLeft--;
          }
        }, 1000);
        this.timerId = timerId;
        return res;
      } catch (err) {
        this.currentSurvey.loading = false;
        throw err;
      }
    },

    resetTimer() {
      if (this.timerId !== null) {
        clearInterval(this.timerId);
      }
      this.timerId = null;
      this.endTime = null;
      this.timeLeft = null;
    },

    async storeSurvey(survey) {
      delete survey.image_url;
      let response;
      if (survey.id) {
        response = await surveyService.storeSurvey(survey);
        this.currentSurvey.data = response.data.data;
      } else {
        response = await surveyService.storeSurvey(survey);
        this.currentSurvey.data = response.data.data;
      }
      return response;
    },
    async storeSurveyAnswer({surveyId, answers}) {
      return surveyService.storeSurveyAnswer(surveyId, answers);
    },
    async deleteSurvey(id) {
      const res = await surveyService.deleteSurvey(id);
      await this.getSurveys();
      return res;
    },
  },  
  persist: {
    paths: ['endTime', 'timerId', 'timeLeft'],
  },
});
    