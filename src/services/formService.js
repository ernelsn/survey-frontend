class FormService {
  constructor(client) {
    this.client = client;
  }

  async getForms(url = "/api/v1/forms") {
    return await this.client.get(url);
  }

  async fetchForm(id) {
    return await this.client.get(`/api/v1/forms/${id}`);
  }

  async getFormBySlug(slug) {
    return await this.client.get(`/api/v1/forms/${slug}/public`);
  }

  // async createForm(form) {
  //   return await this.client.post("/api/v1/forms", form);
  // }

  // async updateForm(form) {
  //   return await this.client.put(`/api/v1/forms/${form.id}`, form);
  // }

  async storeForm(form) {
    if (form.id) {
      return await this.client.patch(`/api/v1/forms/${form.id}`, form);
    } else {
      return await this.client.post("/api/v1/forms", form);
    }
  }

  async storeFormResponse(formId, responses) {
    return await this.client.post(`/api/v1/forms/${formId}/responses`, {
      responses,
    });
  }

  async destroyForm(id) {
    return await this.client.delete(`/api/v1/forms/${id}`);
  }

  async showResults(id) {
    return await this.client.get(`/api/v1/forms/${id}/results`);
  }
}

export default FormService;

