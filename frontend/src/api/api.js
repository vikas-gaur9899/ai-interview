import axios from "axios";

/* ====================================================
   API INSTANCE
==================================================== */
console.log(
  "📡 API BASE URL:",
  import.meta.env.VITE_API_URL
);
const API = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL,

  withCredentials: true

});

/* ====================================================
   REQUEST INTERCEPTOR
==================================================== */

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "adminToken"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);

/* ====================================================
   RESPONSE INTERCEPTOR
==================================================== */

API.interceptors.response.use(

  (response) => response,

  (error) => {

    /* ================= AUTO LOGOUT ================= */

    if (
      error.response?.status === 401
    ) {

      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminInfo"
      );

      window.location.href =
        "/admin/login";

    }

    return Promise.reject(error);

  }

);

export default API;