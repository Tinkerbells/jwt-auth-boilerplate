import axios, { AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000"

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('accessToken')!);
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    console.log("error", error);
    const originalRequest = error.config;
    if (error.response.status === 403) {
      originalRequest._retry = true;
      try {
        const token = await refreshToken()
        originalRequest.headers.authorization = `Bearer ${token}`;
        return await axios(originalRequest);
      } catch (error) {
        console.log(error)
      }
    }
    return Promise.reject(error);
  }
);

async function refreshToken(): Promise<string> {
  try {
    console.log("refreshToken");
    const response = await axios.post(
      BASE_URL + "/api/v1/auth/refresh",
      null,
      {
        withCredentials: true,
      }
    );
    console.log("response from refreshapi ", response);
    return response.data; // Assuming response contains the new access token
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error; // Propagate error to caller
  }
}

