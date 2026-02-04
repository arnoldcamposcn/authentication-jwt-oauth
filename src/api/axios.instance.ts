// src/api/axios.instance.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getErrorCode, shouldNotRefresh } from "../utils/errorHandler";
import { API_ENDPOINTS } from "../components/shared/api.endpoints";

/* =====================================================
   ACCESS TOKEN EN MEMORIA (VOLÁTIL)
===================================================== */
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

/* =====================================================
   INSTANCIA AXIOS
===================================================== */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true, // necesario para cookies httpOnly (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   INTERCEPTOR DE REQUEST (INJECTA ACCESS TOKEN)
===================================================== */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =====================================================
   GESTIÓN DE REFRESH CONCURRENTE
===================================================== */
let isRefreshing = false;

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else if (token) promise.resolve(token);
  });

  failedQueue = [];
};

/* =====================================================
   INTERCEPTOR DE RESPONSE (AUTO REFRESH INTELIGENTE)
===================================================== */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 🌐 Error de red
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const errorCode = getErrorCode(error);

    // Solo interceptamos 401
    if (status === 401 && !originalRequest._retry) {
      /* =====================================================
         VERIFICAR SI NO DEBE INTENTAR REFRESH
         (Usa errorCode + URL como respaldo)
      ===================================================== */
      if (shouldNotRefresh(errorCode, originalRequest.url)) {
        return Promise.reject(error);
      }

      /* =====================================================
         EVITAR LOOP SI FALLA /auth/refresh
      ===================================================== */  
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        setAccessToken(null);
        return Promise.reject(error);
      }

      /* =====================================================
         SI NO HAY ACCESS TOKEN EN MEMORIA → NO REFRESH
      ===================================================== */
      if (!accessToken) {
        return Promise.reject(error);
      }

      /* =====================================================
         SI YA HAY REFRESH EN CURSO → ENCOLAR
      ===================================================== */
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post<{ accessToken: string }>(
          API_ENDPOINTS.AUTH.REFRESH
        );

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        setAccessToken(null);

        // Aquí la app (AuthContext/Router) decide si hace logout
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
