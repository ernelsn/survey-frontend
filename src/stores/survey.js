import { defineStore } from 'pinia';
import axiosClient from "../axios";

export const useSurveyStore = defineStore({
  id: 'survey',
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
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    endTime: null,
    timerId: null,
    timeLeft: null,
    now: Date.now(),
  }),
  actions: {
    async getSurveys({url = null} = {}) {
      this.setSurveysLoading(true);
      url = url || "/survey";
      const res = await axiosClient.get(url);
      this.setSurveysLoading(false);
      this.setSurveys(res.data);
      return res;
    },
    async getSurvey(id) {
      this.setCurrentSurveyLoading(true);
      try {
        const res = await axiosClient.get(`/survey/${id}`);
        this.setCurrentSurvey(res.data);
        this.setCurrentSurveyLoading(false);
        return res;
      } catch (err) {
        this.setCurrentSurveyLoading(false);
        throw err;
      }
    },
    async getSurveyBySlug(slug) {
      this.resetTimer();
      this.setCurrentSurveyLoading(true);
      try {
        const res = await axiosClient.get(`/survey-by-slug/${slug}`);
        this.setCurrentSurvey(res.data);
        let startTimeKey = 'startTime-' + slug;
        let startTime = localStorage.getItem(startTimeKey);
        if (startTime === null) {
          startTime = Date.now();
          localStorage.setItem(startTimeKey, startTime);
        }
        let timeLimit = Number(res.data.data.time_limit);
        let endTime = Number(startTime) + timeLimit * 1000;
        this.setEndTime(endTime);
        this.setCurrentSurveyLoading(false);
        let timerId = setInterval(() => {
          this.setNow();
          this.decrementTimeLeft();
        }, 1000);
        this.setTimerId(timerId);
        return res;
      } catch (err) {
        this.setCurrentSurveyLoading(false);
        throw err;
      }
    },            
    resetTimer() {
      if (this.timerId !== null) {
        clearInterval(this.timerId);
      }
      this.setTimerId(null);
      this.setEndTime(null);
      this.setTimeLeft(null);
    },
    async saveSurvey(survey) {
      delete survey.image_url;
      let response;
      if (survey.id) {
        response = await axiosClient.put(`/survey/${survey.id}`, survey);
        this.setCurrentSurvey(response.data);
      } else {
        response = await axiosClient.post("/survey", survey);
        this.setCurrentSurvey(response.data);
      }
      return response;
    },
    async deleteSurvey(id) {
      const res = await axiosClient.delete(`/survey/${id}`);
      await this.getSurveys();
      return res;
    },
    saveSurveyAnswer({surveyId, answers}) {
      return axiosClient.post(`/survey/${surveyId}/answer`, {answers});
    },
    setSurveysLoading(loading) {
      this.surveys.loading = loading;
    },
    setSurveys(surveys) {
      this.surveys.links = surveys.meta.links;
      this.surveys.data = surveys.data;
    },
    setCurrentSurveyLoading(loading) {
      this.currentSurvey.loading = loading;
    },
    setCurrentSurvey(survey) {
      this.currentSurvey.data = survey.data;
    },
    setEndTime(endTime) {
      this.endTime = endTime;
    },
    setTimerId(timerId) {
      this.timerId = timerId;
    },
    setTimeLeft(timeLeft) {
      this.timeLeft = timeLeft;
    },
    setNow() {
      this.now = Date.now();
    },
    decrementTimeLeft() {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    },
  },
  persist: {
    paths: ['endTime', 'timerId', 'timeLeft'],
  },
});
