import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  timeout: 60000,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (err) => {
    const error = {
      status: err.response?.status || 0,
      original: err,
      validation: {},
      message: null,
    };

    if (err.response) {
      switch (err.response.status) {
        case 422:
          for (let field in err.response.data.errors) {
            error.validation[field] = err.response.data.errors[field][0];
          }
          error.message = err.response.data.message || "Validation failed";
          break;
        case 500:
          error.message = "Something went really bad. Sorry.";
          break;
        default:
          error.message = err.response.data.message || "An unexpected error occurred.";
      }
    } else if (err.request) {
      error.message = "No response received from the server. Please check your network connection.";
    } else {
      error.message = err.message || "An error occurred while setting up the request.";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

