class SurveyService {
  constructor(client) {
    this.client = client;
  }

  async getSurveys(url = "/api/survey") {
    return await this.client.get(url);
  }

  async fetchSurvey(id) {
    return await this.client.get(`/api/survey/${id}`);
  }

  async getSurveyBySlug(slug) {
    return await this.client.get(`/api/survey-by-slug/${slug}`);
  }

  async storeSurvey(survey) {
    if (survey.id) {
      return await this.client.put(`/api/survey/${survey.id}`, survey);
    } else {
      return await this.client.post("/api/survey", survey);
    }
  }

  async storeSurveyAnswer(surveyId, answers) {
    return await this.client.post(`/api/survey/${surveyId}/answer`, {
      answers,
    });
  }

  async deleteSurvey(id) {
    return await this.client.delete(`/api/survey/${id}`);
  }
}

export default SurveyService;
