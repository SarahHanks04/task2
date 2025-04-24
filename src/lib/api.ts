import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const makeRequest = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: unknown
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export default api;
