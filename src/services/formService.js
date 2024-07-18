class FormService {
  constructor(client) {
    this.client = client;
  }

  async getForms(url = "/api/v1/forms") {
    try {
      return await this.client.get(url);
    } catch (error) {
      throw error;
    }
  }

  async getForm(id) {
    try {
      return await this.client.get(`/api/v1/forms/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async getFormBySlug(slug) {
    return await this.client.get(`/api/v1/forms/${slug}/public`);
  }

  async storeForm(form) {
    try {
      if (form.id) {
        return await this.client.patch(`/api/v1/forms/${form.id}`, form);
      } else {
        return await this.client.post("/api/v1/forms", form);
      }
    } catch (error) {
      throw error;
    }
  }

  async storeFormResponse(formId, responses) {
    return await this.client.post(`/api/v1/forms/${formId}/responses`, {
      responses,
    });
  }

  async updateFormResponseAcceptance(id) {
    return await this.client.patch(`/api/v1/forms/${id}/response-acceptance`, id);
  }

  async destroyForm(id) {
    return await this.client.delete(`/api/v1/forms/${id}`);
  }
}

export default FormService;

