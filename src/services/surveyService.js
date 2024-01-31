class SurveyService {
  constructor(client) {
    this.client = client;
  }

  async getSurveys(url = "/api/v1/survey") {
    return await this.client.get(url);
  }

  async fetchSurvey(id) {
    return await this.client.get(`/api/v1/survey/${id}`);
  }

  async getSurveyBySlug(slug) {
    return await this.client.get(`/api/v1/survey-by-slug/${slug}`);
  }

  async storeSurvey(survey) {
    if (survey.id) {
      return await this.client.put(`/api/v1/survey/${survey.id}`, survey);
    } else {
      return await this.client.post("/api/v1/survey", survey);
    }
  }

  async storeSurveyAnswer(surveyId, answers) {
    return await this.client.post(`/api/v1/survey/${surveyId}/answer`, {
      answers,
    });
  }

  async deleteSurvey(id) {
    return await this.client.delete(`/api/v1/survey/${id}`);
  }
}

export default SurveyService;
