class AuthService {
  constructor(client) {
    this.client = client;
  }

  async getToken() {
    return await this.client.get(`/sanctum/csrf-cookie`);
  }

  async fetchUser() {
    const data = await this.client.get(`/api/user`);
    return data.data;
  }

  async register(user) {
    return await this.client.post(`/register`, user);
  }

  // Provides more control over what data is sent
  // async register(user) {
  //   return await this.client.post(`/register`, {
  //     name: user.name,
  //     email: user.email,
  //     password: user.password,
  //     password_confirmation: user.password_confirmation
  //   });
  // }

  async login(user) {
    return await this.client.post(`/login`, user);
  }

  async logout() {
    return await this.client.post(`/logout`);
  }

  async forgotPassword(user) {
    return await this.client.post(`/forgot-password`, user);
  }

  async passwordReset(user) {
    return await this.client.post(`/reset-password`, user);
  }
}

export default AuthService;
