import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  timeout: 60000,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json'
  }
});

axiosClient.interceptors.response.use(
  response => response,
  err => {
    const error = {
      status: err.response?.status,
      original: err,
      validation: {},
      message: null,
    };
 
    switch (err.response?.status) {
      case 422:
        for (let field in err.response.data.errors) {
          error.validation[field] = err.response.data.errors[field][0];
        }
        break;
      // case 422:
      //   error.validation = err.response.data.errors;
      //   error.message = err.response.data.message;
      //   break;
      // case 403:
      //   error.message = "You're not allowed to do that.";
      //   break;
      // case 401:
      //   error.message = "Please re-login.";
      //   break;
      case 500:
        error.message = "Something went really bad. Sorry.";
        break;
      default:
        error.message = err.message || "Something went wrong. Please try again later.";
    }
 
    return Promise.reject(error);
  }
);

export default axiosClient;