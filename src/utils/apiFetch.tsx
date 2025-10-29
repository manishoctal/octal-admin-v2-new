// api.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export function getHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  headers: getHeaders(),
});

let activeRequests = 0;

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (window?.location?.pathname !== "/service-provider-manager/edit") {
    if (activeRequests === 0) {
      document.getElementById("loader")?.classList.remove("hidden");
    }
    activeRequests++;
  }

  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    if (activeRequests === 0) {
      document.getElementById("loader")?.classList.add("hidden");
    }
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    if (window?.location?.pathname !== '/login'&&window?.location?.pathname !== '/') {
      if (status === 403 || status === 409 || status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("uniqueId");
        window.location.href = "/login";
      }
    }else if(window?.location?.pathname=='/'&&localStorage.getItem('token')){
      if (status === 403 || status === 409 || status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("uniqueId");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export function apiGet<T = any>(url: string, params: Record<string, any> = {}) {
  return instance.get<T>(url, { params });
}

export function apiPost<T = any>(url: string, body: any) {
  return instance.post<T>(url, body);
}

export function apiPut<T = any>(url: string, body: any) {
  return instance.put<T>(url, body);
}

export function apiDelete<T = any>(url: string) {
  return instance.delete<T>(url);
}

export default instance;
