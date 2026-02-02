import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

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
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   INTERCEPTOR DE REQUEST
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
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/* =====================================================
   INTERCEPTOR DE RESPONSE (SILENT REFRESH)
===================================================== */

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Solo manejamos 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Evitar loops infinitos
      if (originalRequest.url?.includes("/auth/refresh")) {
        setAccessToken(null);
        return Promise.reject(error);
      }

      // Si ya hay un refresh en curso, encolamos la request
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // El backend lee la cookie httpOnly automáticamente
        const response = await api.post<{ accessToken: string }>(
          "/auth/refresh"
        );

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);

        // Liberamos la cola
        processQueue(null, newAccessToken);

        // Reintentamos la request original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        setAccessToken(null);

        // Aquí NO forzamos redirect
        // La app (AuthContext / Router) debe reaccionar
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
