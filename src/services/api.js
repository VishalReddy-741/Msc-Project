import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const res = await axios.post("http://localhost:8000/api/auth/token/refresh/", { refresh });
          localStorage.setItem("access_token", res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login/", data),
  register: (data) => api.post("/auth/register/", data),
  getMe: () => api.get("/auth/me/"),
  updateMe: (data) => api.patch("/auth/me/", data),
  getStudents: () => api.get("/auth/students/"),
};

export const adminAPI = {
  listUsers: () => api.get("/auth/users/"),
  createUser: (data) => api.post("/auth/users/", data),
  updateUser: (id, data) => api.patch(`/auth/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}/`),
};

export const projectsAPI = {
  list: () => api.get("/projects/"),
  create: (data) => api.post("/projects/", data),
  get: (id) => api.get(`/projects/${id}/`),
  update: (id, data) => api.patch(`/projects/${id}/`, data),
  delete: (id) => api.delete(`/projects/${id}/`),
};

export const tasksAPI = {
  list: (params) => api.get("/tasks/", { params }),
  create: (data) => api.post("/tasks/", data),
  get: (id) => api.get(`/tasks/${id}/`),
  update: (id, data) => api.patch(`/tasks/${id}/`, data),
  delete: (id) => api.delete(`/tasks/${id}/`),
  updateProgress: (id, data) => api.patch(`/tasks/${id}/progress/`, data),
};

export const dependenciesAPI = {
  list: (params) => api.get("/dependencies/", { params }),
  create: (data) => api.post("/dependencies/", data),
  delete: (id) => api.delete(`/dependencies/${id}/`),
};

export const scheduleAPI = {
  get: (projectId) => api.get(`/schedule/${projectId}/`),
  compute: (projectId) => api.post(`/schedule/${projectId}/compute/`),
};

export const contactAPI = {
  send: (data) => api.post("/auth/contact/", data),
};

export default api;
