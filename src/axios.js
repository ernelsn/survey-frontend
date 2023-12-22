import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: "application/json"
  }
});

// axiosClient.interceptors.response.use(null, (err) => {
//   const error = {
//     status: err.response?.status,
//     original: err,
//     validation: {},
//     message: null
//   };

//   if (err.response?.status === 422) {
//     for (let field in err.response.data.errors) {
//       error.validation[field] = error.response.data.errors[field][0];
//     }
//   } else {
//     error.message = "Something went wrong. Please try again later.";
//   }

//   return Promise.reject(error);
// });

export default axiosClient;
