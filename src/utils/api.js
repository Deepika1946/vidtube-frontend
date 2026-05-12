import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/users/refresh-token`,
          {},
          { withCredentials: true },
        );

        return api.request(err.config);
      } catch {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  },
);

export default api;
