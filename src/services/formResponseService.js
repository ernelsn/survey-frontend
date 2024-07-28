class FormService {
    constructor(client) {
      this.client = client;
    }

    async getFormResponse(id) {
      return await this.client.get(`/api/v1/forms/${id}/responses`);
    }
  
    async storeFormResponse(formId, responses) {
      try {
        return await this.client.post(`/api/v1/forms/${formId}/responses`, {
          responses,
        });
      } catch(error) {
        throw error;
      }
    }
  
    async showResults(id) {
      return await this.client.get(`/api/v1/forms/${id}/responses/results`);
    }

    async deleteResponse(formId, responseId) {
      return await this.client.delete(`/api/v1/forms/${formId}/responses/${responseId}`);
    }
  }
  
  export default FormService;
  
  