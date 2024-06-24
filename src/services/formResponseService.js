class FormService {
    constructor(client) {
      this.client = client;
    }

    async getFormResponse(id) {
      return await this.client.get(`/api/v1/forms/${id}/responses`);
    }
  
    async storeFormResponse(formId, responses) {
      return await this.client.post(`/api/v1/forms/${formId}/responses`, {
        responses,
      });
    }
  
    async showResults(id) {
      return await this.client.get(`/api/v1/forms/${id}/responses/results`);
    }
  }
  
  export default FormService;
  
  